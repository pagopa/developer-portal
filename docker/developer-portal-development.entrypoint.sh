#! /bin/bash
set -e

npm install

# Execute the given or default command:
exec "$@"
