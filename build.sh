# Build command format is
# bash build.sh
#
# This app is frontend-only. The `ecommerce-mock-server/` folder is a local dev
# mock of a third-party ecommerce vendor and is NOT part of the production
# deployment, so the production build is just the UI React app.

set -e
# The above command fails the build if any one of the below steps fail.

rm -rf to-deploy
mkdir to-deploy

#UI Build
cd ui
rm -rf build
rm -rf node_modules
npm install
npm run precommit
npm run build
zip -r ui.zip build/
mv ui.zip ../to-deploy
cd ..
