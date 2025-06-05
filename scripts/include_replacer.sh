#!/bin/bash

cd ../apps/nextjs-website/docs/
set -e

echo "🔧 Inserimento contenuti dopo {% include %}..."

# Trova tutti i file .md che contengono "{% include"
md_files=$(grep -rl --include="*.md" '{% include' .)

if [ -z "$md_files" ]; then
  echo "✅ Nessuna occorrenza di '{% include' trovata nei file .md"
  exit 0
fi

for file in $md_files; do
  echo "📄 Elaborazione: $file"

  # Estrae l'hash dalla prima directory del path (dopo ./)
  if [[ "$file" =~ \./([^/]+)/ ]]; then
    hash_dir="${BASH_REMATCH[1]}"
    echo "   🔑 Hash identificato: $hash_dir"
  else
    echo "   ⚠️  Impossibile estrarre l'hash da $file"
    continue
  fi

  tmp_file=$(mktemp)

  while IFS= read -r line; do
    if [[ $line =~ \{\%\ include\ \"([^\"]+)\"\ \%\} ]]; then
      include_path="${BASH_REMATCH[1]}"

      # Sostituisce ../.gitbook/includes/... con ./<hash>/.gitbook/includes/...
      mapped_path="${include_path/..\/.gitbook\/includes/.\/$hash_dir\/.gitbook\/includes}"

      echo "$line" >> "$tmp_file"

      if [[ -f "$mapped_path" ]]; then
        echo "   ➕ Include: $include_path → $mapped_path"
        cat "$mapped_path" >> "$tmp_file"
        echo "{% endinclude %}" >> "$tmp_file"
      else
        echo "   ⚠️  File incluso non trovato: $mapped_path"
      fi
    else
      echo "$line" >> "$tmp_file"
    fi
  done < "$file"

  mv "$tmp_file" "$file"
  echo "   ✅ File aggiornato: $file"
  echo
done