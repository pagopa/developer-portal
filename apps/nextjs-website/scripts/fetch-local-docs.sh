git submodule init
git submodule update
cd  docs 
# discard all untracked changes
git clean -fd
git checkout docs/from-gitbook 
git pull
# copy all files to root ovveriding existing files
mv docs/* .
rm -R docs/
