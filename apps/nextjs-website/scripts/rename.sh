#!/bin/bash
for file in "$@"; do
    newname=$(echo "$file" | sed 's/README (1).md/README_1.md/')
    mv "$file" "$newname"
done
