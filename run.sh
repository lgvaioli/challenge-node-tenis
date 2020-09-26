#!/bin/bash

# Install backend dependencies if node_modules folder doesn't exist. Kinda
# ugly, but we need them to run generate_token.js
if [ ! -d node_modules ]; then
  npm install
fi

# Generate token file if it doesn't exist
if [ ! -f backend/token.json ]; then
  cd backend
  node generate_token.js
  cd ..
fi

# Run docker deploy
docker-compose up
