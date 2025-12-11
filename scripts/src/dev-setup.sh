#!/bin/bash

# 16-byte random hex string
uuid_raw=$(openssl rand -hex 16)

# UUID as JWT secret(which you need to update it in ./api/.env)
uuid_formatted="${uuid_raw:0:8}-${uuid_raw:8:4}-${uuid_raw:12:4}-${uuid_raw:16:4}-${uuid_raw:20:12}"


echo "installing API dependencies."
cd ../api
npm i 
echo "creating api/.env file."
rm -f "./.env"
cat <<EOF > ".env"
NODE_ENV=development
JWT_API_SECRET=$uuid_formatted
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
REACT_APP_API_AUTH_URL=http://localhost:8080/auth
REACT_APP_ENCRYPTION_KEY=123
EOF

echo "created api/.env file."


echo "Setting up an initial development app."
cd ../scripts
npm run create-dev-app

echo "Creating content model and its entry for the latest app."
npm run create-content-model

echo "Please run 'cd ../api' and 'npm run dev' to start the backend server."
echo "Please run 'cd ../ui' and 'npm run start' or 'npm run startWin' to start the UI app."
