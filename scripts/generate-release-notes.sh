#!/bin/sh
# requires git-cliff (installed locally via devDependencies or on PATH)
# Generate release notes from semantic commits using cliff.toml
# Usage: generate-release-notes.sh [--preview | --tag <version>]

set -eu

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)

if [ -x "$REPO_ROOT/node_modules/.bin/git-cliff" ]; then
  GIT_CLIFF="$REPO_ROOT/node_modules/.bin/git-cliff"
elif command -v git-cliff >/dev/null 2>&1; then
  GIT_CLIFF=$(command -v git-cliff)
else
  echo "Error: git-cliff binary not found. Run npm install." >&2
  exit 1
fi

export CLIFF_CURRENT_REF=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "HEAD")
export CLIFF_CURRENT_SHA_SHORT=$(git rev-parse --short HEAD 2>/dev/null || echo "")
export CLIFF_CURRENT_SHA=$(git rev-parse HEAD 2>/dev/null || echo "")
export CLIFF_PREVIOUS_TAG=$(git describe --tags --match "v[0-9]*.[0-9]*.[0-9]*" --abbrev=0 2>/dev/null || echo "")

if [ -n "$CLIFF_PREVIOUS_TAG" ]; then
  export CLIFF_PREVIOUS_SHA_SHORT=$(git rev-parse --short "$CLIFF_PREVIOUS_TAG^{commit}" 2>/dev/null || echo "")
  export CLIFF_PREVIOUS_SHA=$(git rev-parse "$CLIFF_PREVIOUS_TAG^{commit}" 2>/dev/null || echo "")
else
  export CLIFF_PREVIOUS_SHA_SHORT=""
  export CLIFF_PREVIOUS_SHA=""
fi

if [ "${1:-}" = "--preview" ]; then
  "$GIT_CLIFF" --unreleased --strip header --config "$REPO_ROOT/cliff.toml"
elif [ "${1:-}" = "--tag" ]; then
  if [ -z "${2:-}" ]; then
    echo "Usage: $0 --tag <version>" >&2
    exit 1
  fi
  "$GIT_CLIFF" --unreleased --tag "$2" --strip header --config "$REPO_ROOT/cliff.toml"
else
  "$GIT_CLIFF" --latest --strip header --config "$REPO_ROOT/cliff.toml"
fi
