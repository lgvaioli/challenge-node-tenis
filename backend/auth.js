const fs = require('fs');
const { google } = require('googleapis');

const CREDENTIALS_FILE = 'backend/credentials.json';

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'backend/token.json';

// Global to keep credentials
let credentials = null;

// Global to keep auth client
let authClient = null;

// Reads credentials from file and returns it as a JSON object.
function readCredentials(filename) {
  const content = fs.readFileSync(filename);
  return JSON.parse(content);
}

// Create an OAuth2 client
function getAuthClient() {
  if (authClient) {
    return authClient;
  }

  // Initialize credentials if this is the first authorized call
  if (!credentials) {
    credentials = readCredentials(CREDENTIALS_FILE);
  }

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  authClient = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  authClient.setCredentials(token);

  return authClient;
}

module.exports = {
  getAuthClient,
};
