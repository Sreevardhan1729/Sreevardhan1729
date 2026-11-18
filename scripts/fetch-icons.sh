#!/usr/bin/env bash
# Downloads the tech-icon row from skillicons.dev (MIT) once, so the README never loads it at view time.
# Usage: scripts/fetch-icons.sh
set -euo pipefail

ICONS="go,ts,react,py,cpp,kafka,docker,postgres,redis,nextjs,aws,prometheus"
ASSETS="$(cd "$(dirname "$0")/.." && pwd)/assets"

for theme in light dark; do
  out="$ASSETS/stack-$theme.svg"
  code=$(curl -sS -o "$out" -w '%{http_code}' "https://skillicons.dev/icons?i=$ICONS&theme=$theme&perline=12")
  if [ "$code" != "200" ] || ! grep -q '<svg' "$out"; then
    echo "skillicons.dev returned $code for $theme" >&2
    rm -f "$out"
    exit 1
  fi
  echo "wrote assets/stack-$theme.svg"
done
