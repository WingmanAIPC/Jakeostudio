#!/usr/bin/env bash
# Small encodes of the design archive for the /work strip (the originals run up to 24 MB).
#
#   scripts/encode-archive-thumbs.sh
#
# Writes public/archive/<slug>.jpg at 640px on the long edge. Keep the list in step
# with ARCHIVE_DESIGNS in lib/workIndex.ts.
set -euo pipefail

PUB="$(cd "$(dirname "$0")/.." && pwd)/public"
mkdir -p "$PUB/archive"

encode() {
  sips -s format jpeg -s formatOptions 72 -Z 640 "$PUB/$1" --out "$PUB/archive/$2.jpg" >/dev/null
}

encode "BionicKid.jpg" bionic-kid
encode "OutofSync.jpg" out-of-sync
encode "LandoNorris.jpg" lando-norris
encode "SSLCards.jpg" ssl-cards
encode "12.17.23.jpg" dark-side
encode "CrystalStrawberry.jpg" crystal-strawberry
encode "BeatsStudioBuds.png" beats-studio-buds
encode "PlayboiCarti.jpg" playboi-carti
encode "SocialHour.jpg" social-hour
encode "KoreanBBQ.jpg" korean-bbq
encode "WHMDayton.jpg" whm-dayton
encode "Senior Exhibition Radial Poster.jpg" senior-exhibition

ls -lh "$PUB/archive"
