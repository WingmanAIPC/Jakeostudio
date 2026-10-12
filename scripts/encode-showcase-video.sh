#!/usr/bin/env bash
# Encode a highlight reel for the landing hero (components/showcase).
#
#   scripts/encode-showcase-video.sh <source-video> <slug> [thumb-seconds]
#
# Writes to public/showcase/:
#   <slug>-1080.mp4   1920×1080 30fps H.264 — landscape / desktop
#   <slug>-720.mp4    1280×720  30fps H.264 — portrait / phones
#   <slug>-poster.jpg exact first frame (shown until playback starts — keeps the swap seamless)
#   <slug>-thumb.jpg  frame at [thumb-seconds] (default 6) — rail hover preview + blurred mobile backdrop
#
# Then add a slide to SHOWCASE_SLIDES in lib/showcase.ts with `duration` set to the
# printed length. Audio is kept when the source has it (sound toggle); otherwise mark
# the clip `silent: true`.
set -euo pipefail

SRC="${1:?source video}"
SLUG="${2:?slug, e.g. jiu-jitsu}"
THUMB_T="${3:-6}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/showcase/${SLUG}"
mkdir -p "$(dirname "$OUT")"

if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$SRC" | grep -q .; then
  A1=(-c:a aac -b:a 128k -ac 2); A2=(-c:a aac -b:a 96k -ac 2); HAS_AUDIO=yes
else
  A1=(-an); A2=(-an); HAS_AUDIO=no
fi

ffmpeg -v error -y -i "$SRC" -vf "scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,fps=30" \
  -c:v libx264 -preset slow -crf 23 -profile:v high -level 4.1 -pix_fmt yuv420p -g 60 \
  -maxrate 5M -bufsize 10M "${A1[@]}" -movflags +faststart "${OUT}-1080.mp4"
ffmpeg -v error -y -i "$SRC" -vf "scale=1280:720:force_original_aspect_ratio=increase:flags=lanczos,crop=1280:720,fps=30" \
  -c:v libx264 -preset slow -crf 24 -profile:v high -level 4.0 -pix_fmt yuv420p -g 60 \
  -maxrate 2500k -bufsize 5M "${A2[@]}" -movflags +faststart "${OUT}-720.mp4"
ffmpeg -v error -y -i "$SRC" -vf "scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080" \
  -frames:v 1 -q:v 3 "${OUT}-poster.jpg"
ffmpeg -v error -y -ss "$THUMB_T" -i "$SRC" -vf "scale=1280:720:force_original_aspect_ratio=increase:flags=lanczos,crop=1280:720" \
  -frames:v 1 -q:v 4 "${OUT}-thumb.jpg"

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${OUT}-1080.mp4")
echo "Encoded ${SLUG}: duration ${DUR}s, audio: ${HAS_AUDIO}"
ls -lh "${OUT}"-*
