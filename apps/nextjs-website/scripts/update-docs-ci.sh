# remove old docs if any
rm -rf ./docs
mv ./checkout_path/docs .

./scripts/replace-include-tags.sh ./docs

# copy all the gitbook assets to public assets of nextjs-website
dest='public/gitbook/'
# create all the assets folder otherwise the copy will fail
find docs -type d -path '*/.gitbook/assets' -exec mkdir -p $dest'{}' ';'
# copy all the assets from docs to public assets of nextjs-website
find docs -type d -path "*/.gitbook/includes" -prune -o -type f -path "*/.gitbook/*" -exec cp --parents '{}' "$dest" ';'
