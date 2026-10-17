#!/usr/bin/env python3
"""Build an Apple Live Photo pair (JPEG + MOV) from a rendered clip and its key frame.

Photos pairs the two files when both carry the same content identifier:
  * JPEG  -> Apple MakerNote tag 0x0011 (ContentIdentifier)
  * MOV   -> moov/meta key `com.apple.quicktime.content.identifier`
             + a timed-metadata track holding `com.apple.quicktime.still-image-time`
No Apple frameworks are needed; the QuickTime atoms are written here directly.

usage: livephoto.py --video clip.mp4 --still key.png --out DIR --name BASE
                    [--size WxH] [--crop W:H:X:Y] [--crf 24]
The key photo is the clip's first frame (still-image-time = 0).
"""
import argparse
import os
import struct
import subprocess
import tempfile
import uuid

import piexif
from PIL import Image, ImageCms


# ------------------------------------------------------------------ JPEG ----
def apple_makernote(content_id: str) -> bytes:
    """Minimal Apple iOS MakerNote: header, big-endian IFD, offsets from note start."""
    ident = content_id.encode('ascii') + b'\x00'
    entries = [
        (0x0001, 9, 1, struct.pack('>i', 14)),          # MakerNoteVersion (SLONG)
        (0x0011, 2, len(ident), ident),                  # ContentIdentifier (ASCII)
    ]
    header = b'Apple iOS\x00' + b'\x00\x01' + b'MM'
    ifd_start = len(header)
    ifd_len = 2 + 12 * len(entries) + 4
    data_off = ifd_start + ifd_len
    ifd = struct.pack('>H', len(entries))
    data = b''
    for tag, typ, count, val in entries:
        if len(val) <= 4:
            ifd += struct.pack('>HHI', tag, typ, count) + val.ljust(4, b'\x00')
        else:
            ifd += struct.pack('>HHII', tag, typ, count, data_off + len(data))
            data += val
            if len(data) % 2:
                data += b'\x00'
    ifd += struct.pack('>I', 0)
    return header + ifd + data


def write_jpeg(img: Image.Image, path: str, content_id: str):
    exif = {
        '0th': {piexif.ImageIFD.Software: b'QATSEL',
                piexif.ImageIFD.ImageDescription: b'QATSEL - Quiet Ambient Techno Soul of Eternal Life'},
        'Exif': {piexif.ExifIFD.MakerNote: apple_makernote(content_id),
                 piexif.ExifIFD.ColorSpace: 1,
                 piexif.ExifIFD.PixelXDimension: img.width,
                 piexif.ExifIFD.PixelYDimension: img.height},
        'GPS': {}, '1st': {}, 'thumbnail': None,
    }
    icc = ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
    img.convert('RGB').save(path, quality=95, subsampling=0, optimize=True, icc_profile=icc,
                            exif=piexif.dump(exif))


# ------------------------------------------------------------------- MOV ----
def box(typ: bytes, payload: bytes) -> bytes:
    return struct.pack('>I', 8 + len(payload)) + typ + payload


def full(typ: bytes, version: int, flags: int, payload: bytes) -> bytes:
    return box(typ, struct.pack('>I', (version << 24) | flags) + payload)


def read_boxes(buf: bytes, start: int, end: int):
    out = []
    p = start
    while p + 8 <= end:
        size, typ = struct.unpack('>I4s', buf[p:p + 8])
        hdr = 8
        if size == 1:
            size = struct.unpack('>Q', buf[p + 8:p + 16])[0]
            hdr = 16
        elif size == 0:
            size = end - p
        out.append((typ, p, size, hdr))
        p += size
    return out


def still_image_track(track_id: int, movie_ts: int, sample_offset: int) -> bytes:
    ts = 600
    dur = 6  # 1/100 s, the way AVFoundation writes it
    # 'mebx' sample entry with one key: mdta/com.apple.quicktime.still-image-time, int8
    keyd = box(b'keyd', b'mdta' + b'com.apple.quicktime.still-image-time')
    dtyp = box(b'dtyp', struct.pack('>II', 0, 65))       # well-known type 65 = signed int8
    key1 = box(struct.pack('>I', 1), keyd + dtyp)
    keys = box(b'keys', key1)
    mebx = box(b'mebx', b'\x00' * 6 + struct.pack('>H', 1) + keys)
    stsd = full(b'stsd', 0, 0, struct.pack('>I', 1) + mebx)
    stts = full(b'stts', 0, 0, struct.pack('>I', 1) + struct.pack('>II', 1, dur))
    stsz = full(b'stsz', 0, 0, struct.pack('>II', 0, 1) + struct.pack('>I', 9))
    stsc = full(b'stsc', 0, 0, struct.pack('>I', 1) + struct.pack('>III', 1, 1, 1))
    total = dur
    stco = full(b'stco', 0, 0, struct.pack('>II', 1, sample_offset))
    stbl = box(b'stbl', stsd + stts + stsc + stsz + stco)
    dref = full(b'dref', 0, 0, struct.pack('>I', 1) + full(b'url ', 0, 1, b''))
    minf = box(b'minf', full(b'nmhd', 0, 0, b'') + box(b'dinf', dref) + stbl)
    hdlr = full(b'hdlr', 0, 0, b'\x00' * 4 + b'meta' + b'\x00' * 12 + b'Core Media Metadata\x00')
    mdhd = full(b'mdhd', 0, 0, struct.pack('>IIIIHH', 0, 0, ts, total, 0x55C4, 0))
    mdia = box(b'mdia', mdhd + hdlr + minf)
    matrix = struct.pack('>9I', 0x10000, 0, 0, 0, 0x10000, 0, 0, 0, 0x40000000)
    tk_dur = int(round(total / ts * movie_ts))
    tkhd = full(b'tkhd', 0, 0xF, struct.pack('>IIIII', 0, 0, track_id, 0, tk_dur) + b'\x00' * 8 +
                struct.pack('>hhhH', 0, 0, 0, 0) + matrix + struct.pack('>II', 0, 0))
    return box(b'trak', tkhd + mdia)


def inject_still_track(path: str):
    buf = bytearray(open(path, 'rb').read())
    top = read_boxes(buf, 0, len(buf))
    moov = [b for b in top if b[0] == b'moov']
    assert moov and moov[0][1] > max(b[1] for b in top if b[0] == b'mdat'), 'expects moov after mdat (no faststart)'
    typ, mp, msize, mh = moov[0]
    kids = read_boxes(buf, mp + mh, mp + msize)
    mvhd = next(k for k in kids if k[0] == b'mvhd')
    mv = mvhd[1] + mvhd[3]
    version = buf[mv]
    if version == 1:
        movie_ts = struct.unpack('>I', buf[mv + 20:mv + 24])[0]
        nti_off = mv + 4 + 8 + 8 + 4 + 8 + 4 + 2 + 10 + 36 + 24
    else:
        movie_ts = struct.unpack('>I', buf[mv + 12:mv + 16])[0]
        nti_off = mv + 4 + 4 + 4 + 4 + 4 + 4 + 2 + 10 + 36 + 24
    next_id = struct.unpack('>I', buf[nti_off:nti_off + 4])[0]
    struct.pack_into('>I', buf, nti_off, next_id + 1)
    # new mdat carrying the sample: [size][local key 1][int8 -1]
    new_mdat = box(b'mdat', struct.pack('>I', 9) + struct.pack('>I', 1) + b'\xff')
    trak = still_image_track(next_id, movie_ts, mp + 8)
    moov_payload = bytes(buf[mp + mh:mp + msize]) + trak
    out = bytes(buf[:mp]) + new_mdat + box(b'moov', moov_payload) + bytes(buf[mp + msize:])
    open(path, 'wb').write(out)


# ------------------------------------------------------------------ main ----
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--video', required=True)
    ap.add_argument('--still', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--name', required=True)
    ap.add_argument('--size')          # WxH: scale after crop
    ap.add_argument('--crop')          # W:H:X:Y (ffmpeg crop)
    ap.add_argument('--crf', default='24')   # ~10 Mbps at 1320x2868: grain survives, size stays near Apple's own
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    cid = str(uuid.uuid4()).upper()

    # key photo
    img = Image.open(a.still).convert('RGB')
    if a.crop:
        w, h, x, y = map(int, a.crop.split(':'))
        img = img.crop((x, y, x + w, y + h))
    if a.size:
        w, h = map(int, a.size.lower().split('x'))
        img = img.resize((w, h), Image.LANCZOS)
    jpg = os.path.join(a.out, a.name + '.JPG')
    write_jpeg(img, jpg, cid)

    # motion: HEVC (hvc1) in QuickTime, identifier in moov/meta, moov at the end
    vf = []
    if a.crop:
        vf.append(f'crop={a.crop}')
    if a.size:
        w, h = a.size.lower().split('x')
        vf.append(f'scale={w}:{h}:flags=lanczos')
    mov = os.path.join(a.out, a.name + '.MOV')
    tmp = tempfile.NamedTemporaryFile(suffix='.mov', delete=False).name
    cmd = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', a.video]
    if vf:
        cmd += ['-vf', ','.join(vf)]
    cmd += ['-an', '-c:v', 'libx265', '-preset', 'medium', '-crf', a.crf, '-pix_fmt', 'yuv420p', '-tag:v', 'hvc1',
            '-x265-params', 'log-level=error:aq-mode=3:psy-rd=2.0:psy-rdoq=1.0',
            '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
            '-movflags', 'use_metadata_tags', '-metadata', f'com.apple.quicktime.content.identifier={cid}',
            '-f', 'mov', tmp]
    subprocess.run(cmd, check=True)
    inject_still_track(tmp)
    os.replace(tmp, mov)
    print(f'{a.name}: {cid}  {os.path.getsize(jpg)//1024} KB + {os.path.getsize(mov)//1024} KB')


if __name__ == '__main__':
    main()
