hash='08ba0361a0e5adc7981ca4a1c45d2576e5a2fa34'
mkdir tmp

# download zip
curl -L 'https://github.com/pagopa/devportal-docs/archive/'$hash'.zip' > ./tmp/out.zip

# unzip the contents
unzip -o -q -d ./tmp ./tmp/out.zip

# move files
mv './tmp/devportal-docs-'$hash'/docs' .

# cleanup
rm -rf ./tmp

# copy all gitbook assets to public assets of nextjs-website
dest='../../apps/nextjs-website/public/gitbook/'
# create folders
find docs -type d -path '*/.gitbook/assets' -exec mkdir -p $dest'{}' ';'
# copy assets to public assets of nextjs-website
find docs -type f -path '*/.gitbook/*' -exec cp '{}' $dest'{}' ';'
