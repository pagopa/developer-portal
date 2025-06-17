git submodule init
git submodule update
mkdir -p .tmp-docs
cd .tmp-docs
# discard all untracked changes
git clean -fd
git checkout docs/from-gitbook 
git pull
cd ..
mkdir -p docs
# remove old docs if any
rm -r -f docs/*
# copy all necessary files to the docs folder
cp -r .tmp-docs/docs/* docs/
./scripts/include_replacer.sh ./docs
