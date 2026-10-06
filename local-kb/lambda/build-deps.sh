#!/bin/bash
# Installs the main dependencies of apps/chatbot-index into /deps, which LocalStack
# mounts in the lambda containers. It is skipped when the poetry files did not change.
set -euo pipefail

HASH=$(cat /src/pyproject.toml /src/poetry.lock | sha256sum | cut -d' ' -f1)
if [ "$(cat /deps/.lock-hash 2>/dev/null)" = "$HASH" ]; then
  echo "-=-=-=-= lambda dependencies are up to date"
  exit 0
fi

echo "-=-=-=-= installing lambda dependencies"
rm -rf /deps/* /deps/.lock-hash
pip install --quiet poetry poetry-plugin-export
cd /src
poetry export --only main --without-hashes -f requirements.txt -o /tmp/requirements.txt
pip install --quiet -r /tmp/requirements.txt -t /deps
echo "$HASH" > /deps/.lock-hash

# The files must belong to the host user, not to root
chown -R "$(stat -c %u:%g /deps)" /deps
echo "-=-=-=-= lambda dependencies installed"
