# The commit hash
hash=${1}

# create temporary directory
mkdir .tmp

# download the documentation
curl -L "https://github.com/pagopa/devportal-docs/archive/$hash.zip" > ./.tmp/docs.zip

# unzip the contents
unzip -o -q -d ./.tmp ./.tmp/docs.zip

# remove old docs if any
rm -r ./docs

# move files
mv ./.tmp/devportal-docs-$hash*/docs .

# cleanup
rm -r ./tmp

# copy all gitbook assets to public assets of nextjs-website
dest='public/gitbook/'
# create folders
find docs -type d -path '*/.gitbook/assets' -exec mkdir -p $dest'{}' ';'
# copy assets to public assets of nextjs-website
find docs -type f -path '*/.gitbook/*' -exec cp '{}' $dest'{}' ';'
