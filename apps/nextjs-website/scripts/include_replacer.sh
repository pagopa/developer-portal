#!/bin/bash

echo "Replacing includes in ${1}..."
cd "${1}"
set -e

echo "Inserting content after {% include %}..."

md_files=$(grep -rl --include="*.md" '{% include' .)

if [ -z "$md_files" ]; then
  echo "No occurrence of '{% include' found in any .md files"
  exit 0
fi

for file in $md_files; do
  echo "Elaborating: $file"

  if [[ "$file" =~ \./([^/]+)/ ]]; then
    hash_dir="${BASH_REMATCH[1]}"
    echo "   Hash identified: $hash_dir"
  else
    echo "   Hash not found for $file"
    continue
  fi

  tmp_file=$(mktemp)

  while IFS= read -r line; do
    if [[ $line =~ \{\%\ include\ \"([^\"]+)\"\ \%\} ]]; then
      include_path="${BASH_REMATCH[1]}"

      mapped_path=$(echo "$include_path" | sed "s|\(\(\.\./\)*\)\.gitbook/includes|./$hash_dir/.gitbook/includes|")

      echo "$line" >> "$tmp_file"

      if [[ -f "$mapped_path" ]]; then
        echo "   Include: $include_path → $mapped_path"
        cat "$mapped_path" >> "$tmp_file"
        echo "{% endinclude %}" >> "$tmp_file"
      else
        echo "   Included file not found at: $mapped_path"
      fi
    else
      echo "$line" >> "$tmp_file"
    fi
  done < "$file"

  mv "$tmp_file" "$file"
  echo "   Documentation updated: $file"
  echo
done
