#!/bin/bash

# The commit hash or branch
hash=${1}

# create temporary directory
mkdir .tmp

# download the documentation
curl -L "https://github.com/pagopa/devportal-docs/archive/$hash.zip" > ./.tmp/docs.zip

# if the branch contains "/" chars they must be replaced with "-"
dir_name="${hash//\//-}"

# unzip the content of the zip
unzip -o -q -d ./.tmp ./.tmp/docs.zip

# remove old docs if any
rm -r ./docs

# move on nextjs-website root the docs folder extracted from the zip
mv ./.tmp/devportal-docs-$dir_name*/docs .

# remove all temporary files
rm -r .tmp

# copy all the gitbook assets to public assets of nextjs-website
dest='public/gitbook/'
# create all the assets folder otherwise the copy will fail
find docs -type d -path '*/.gitbook/assets' -exec mkdir -p $dest'{}' ';'
# copy all the assets from docs to public assets of nextjs-website
find docs -type f -path '*/.gitbook/*' -exec cp '{}' $dest'{}' ';'
