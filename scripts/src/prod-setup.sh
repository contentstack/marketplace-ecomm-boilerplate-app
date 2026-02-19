#!/bin/bash

# Enable link collection mode
export COLLECT_LINKS=true

echo "Creating a new launch project."
npm run deploy-prod-app

echo "Creating a new production marketplace app."
npm run create-prod-app

echo "Creating content model and its entry for the latest app."
npm run create-content-model

echo "Opening all links..."
npm run open-collected-links