#!/bin/bash

echo "installing API dependencies."
cd ../api
npm i 
echo "creating api/.env file."
rm -f "./.env"
cat <<EOF > ".env"
NODE_ENV=development
EOF

echo "created api/.env file."


echo "installing UI dependencies."
cd ../ui
npm i
echo "creating ui/.env file."
rm -f "./.env"
cat <<EOF > ".env"
REACT_APP_UI_URL=http://localhost:4000
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENCRYPTION_KEY=123
EOF

echo "created api/.env file."


echo "Setting up an initial development app."
cd ../scripts
npm run create-dev-app

echo "Please run 'cd ../api' and 'npm run dev' to start the backend server."
echo "Please run 'cd ../ui' and 'npm run start' or 'npm run startWin' to start the UI app."
