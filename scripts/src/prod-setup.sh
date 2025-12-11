#!/bin/bash

echo "Creating a new launch project."
npm run deploy-prod-app

echo "Creating a new production marketplace app."
npm run create-prod-app

echo "Creating content model and its entry for the latest app."
npm run create-content-model