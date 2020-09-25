const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';


function generate_token() {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) {
      return console.log(`Error loading client secret file: ${err.message}`);
    }

    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        // Token file doesn't exist, create it
        create_token_from_console(oAuth2Client);
      } else {
        console.log(`Token file already exists!`);
      }
    });
  });
}

function create_token_from_console(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log(`Authorize this app by visiting this url: ${authUrl}`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();

    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return console.error(`Error while trying to retrieve access token: ${err.message}`);
      }

      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
          return console.error(err);
        }

        console.log(`Token stored to ${TOKEN_PATH}`);
      });
    });
  });
}

generate_token();
