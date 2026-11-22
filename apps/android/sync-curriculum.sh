#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_JSON="${SCRIPT_DIR}/../../packages/curriculum/dist/curriculum.json"
TARGET_DIR="${SCRIPT_DIR}/app/src/main/assets"
TARGET_JSON="${TARGET_DIR}/curriculum.json"

if [[ ! -f "${SOURCE_JSON}" ]]; then
  echo "ERROR: Curriculum bundle not found at: ${SOURCE_JSON}" >&2
  echo "Run 'npm run build' in packages/curriculum/ first." >&2
  exit 1
fi

mkdir -p "${TARGET_DIR}"
cp "${SOURCE_JSON}" "${TARGET_JSON}"

BYTES=$(wc -c < "${TARGET_JSON}")
echo "Synced curriculum.json (${BYTES} bytes) -> ${TARGET_JSON}"
