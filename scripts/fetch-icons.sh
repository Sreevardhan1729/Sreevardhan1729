#!/usr/bin/env bash
# Downloads the README's images once, so the profile never loads them from another host at view time:
# the tech-icon row from skillicons.dev (MIT) and the link badges from shields.io.
# Usage: scripts/fetch-icons.sh
set -euo pipefail

ASSETS="$(cd "$(dirname "$0")/.." && pwd)/assets"
mkdir -p "$ASSETS/badges"

# fetch <url> <path under assets/>: writes only after a 200 response that contains an <svg>.
fetch() {
  local tmp code
  tmp="$(mktemp)"
  code=$(curl -sS -o "$tmp" -w '%{http_code}' "$1")
  if [ "$code" != "200" ] || ! grep -q '<svg' "$tmp"; then
    rm -f "$tmp"
    echo "got $code for $1" >&2
    exit 1
  fi
  mv "$tmp" "$ASSETS/$2"
  chmod 644 "$ASSETS/$2"
  echo "wrote assets/$2"
}

ICONS="go,ts,react,py,cpp,kafka,docker,postgres,redis,nextjs,aws,prometheus"
fetch "https://skillicons.dev/icons?i=$ICONS&theme=light&perline=12" stack-light.svg
fetch "https://skillicons.dev/icons?i=$ICONS&theme=dark&perline=12" stack-dark.svg

BADGE="https://img.shields.io/badge"
fetch "$BADGE/Portfolio-047857?style=flat-square&logo=vercel&logoColor=white" badges/portfolio.svg
fetch "$BADGE/Resume-171714?style=flat-square&logo=googledrive&logoColor=white" badges/resume.svg
fetch "$BADGE/LinkedIn-0A66C2?style=flat-square" badges/linkedin.svg
fetch "$BADGE/Email-171714?style=flat-square&logo=gmail&logoColor=white" badges/email.svg
fetch "$BADGE/LeetCode_2077-FFA116?style=flat-square&logo=leetcode&logoColor=black" badges/leetcode.svg
