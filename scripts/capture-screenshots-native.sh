#!/usr/bin/env bash
# Capture README screenshots from the native iOS Simulator (Maestro).
# Captures light and dark appearance (36 PNGs total).
#
# Usage:
#   npm run screenshots:native              # app must already be installed on simulator
#   npm run screenshots:native:build        # build Release on simulator, then capture
#
# Env:
#   SIMULATOR   Simulator name (default: iPhone 17)
#   MAESTRO_BIN Custom maestro binary path

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SIMULATOR="${SIMULATOR:-iPhone 17}"
APP_ID="com.kataro92.kkorea-hangul"
BUILD=false
FEATURES=(alphabet reading grammar vocabulary review settings)

for arg in "$@"; do
  case "$arg" in
    --build) BUILD=true ;;
    -h|--help)
      echo "Usage: $0 [--build]"
      echo "  --build  Run 'expo run:ios --configuration Release' before capturing"
      exit 0
      ;;
  esac
done

export PATH="${MAESTRO_BIN:+$(dirname "$MAESTRO_BIN")}:$HOME/.maestro/bin:$PATH"

if ! command -v maestro >/dev/null 2>&1; then
  echo "Maestro CLI not found — installing to ~/.maestro/bin …"
  curl -Ls "https://get.maestro.mobile.dev" | bash
  export PATH="$HOME/.maestro/bin:$PATH"
fi

echo "Using Maestro $(maestro --version 2>/dev/null | tail -1)"

# Boot simulator and polish status bar (store-style 9:41).
if ! xcrun simctl list devices booted 2>/dev/null | grep -q "Booted"; then
  echo "Booting simulator: $SIMULATOR"
  xcrun simctl boot "$SIMULATOR" 2>/dev/null || true
fi
open -a Simulator 2>/dev/null || true
xcrun simctl bootstatus booted -b 2>/dev/null || xcrun simctl bootstatus "$SIMULATOR" -b

xcrun simctl status_bar booted override \
  --time "9:41" \
  --batteryState charged \
  --batteryLevel 100 \
  --cellularBars 4 \
  2>/dev/null || true

for theme in light dark; do
  for feature in "${FEATURES[@]}"; do
    mkdir -p "screenshots/$theme/$feature"
  done
done

if [[ "$BUILD" == true ]]; then
  echo "Building Release on $SIMULATOR (first run may take several minutes) …"
  npx expo run:ios --configuration Release --device "$SIMULATOR"
else
  if ! xcrun simctl get_app_container booted "$APP_ID" data >/dev/null 2>&1; then
    echo "App $APP_ID is not installed on the booted simulator."
    echo "Run: npm run screenshots:native:build"
    exit 1
  fi
fi

capture_theme() {
  local appearance=$1
  local shot_dir=$2
  echo ""
  echo "── $appearance mode → $shot_dir/"
  xcrun simctl ui booted appearance "$appearance"
  xcrun simctl terminate booted "$APP_ID" 2>/dev/null || true
  sleep 1
  maestro test -e "SHOT_DIR=$shot_dir" .maestro/flows/_capture-theme.yaml
}

capture_theme light screenshots/light
capture_theme dark screenshots/dark

# Maestro may save without .png in path; normalize to README layout.
for theme in light dark; do
  for feature in "${FEATURES[@]}"; do
    for n in 1 2 3; do
      base="screenshots/$theme/$feature/$n"
      if [[ -f "${base}" && ! "${base}" == *.png ]]; then
        mv "${base}" "${base}.png"
      fi
      if [[ ! -f "${base}.png" ]]; then
        echo "warning: missing ${base}.png" >&2
      fi
    done
  done
done

count=$(find screenshots/light screenshots/dark -name '*.png' -maxdepth 2 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "done — ${count} screenshots in screenshots/{light,dark}/<feature>/1-3.png"
