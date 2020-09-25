const fs = require('fs');
const { google } = require('googleapis');

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) {
    return console.log(`Error loading client secret file: ${err.message}`);
  }

  // Authorize a client with credentials, then call the Google Sheets API.
  makeAuthorizedCall(JSON.parse(content), listGrandSlamWinners);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function makeAuthorizedCall(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return console.log(`Error loading client token: ${err.message}. Did you forget to run generate_token.js?`);
    }

    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// ATP tournaments spreadsheet:
// https://docs.google.com/spreadsheets/d/1GZu4w8_NiJS8I1--C-N5O2dPoj_Bv-ojekMRDS2ToMQ/edit#gid=1490274874
function listGrandSlamWinners(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const ATP_SPREADSHEET_ID = '1GZu4w8_NiJS8I1--C-N5O2dPoj_Bv-ojekMRDS2ToMQ';

  // FIXME: Inefficient, we're getting lots of data we don't use. Optimize me!
  const ATP_SPREADSHEET_RANGE = 'tournaments_1877-2017_unindexed_csv!A2:P';

  const ATP_SPREADSHEET_COLUMN_OFFSET = {
    TOURNEY_YEAR: 0,
    TOURNEY_ID: 3,
    SINGLES_WINNER_NAME: 15,
  }

  const TOURNEY_ID = {
    AUSTRALIAN_OPEN: 580,
    ROLAND_GARROS: 520,
    WIMBLEDON: 540,
    US_OPEN: 560,
  };

  // Takes a TOURNEY_ID and returns the tourney name as a string
  function get_tourney_name(id) {
    switch(id) {
      case TOURNEY_ID.AUSTRALIAN_OPEN:
        return 'Australian Open';
      
      case TOURNEY_ID.ROLAND_GARROS:
        return 'Roland Garros';

      case TOURNEY_ID.WIMBLEDON:
        return 'Wimbledon';

      case TOURNEY_ID.US_OPEN:
        return 'US Open';

      default:
        return 'Unknown tourney id';
    }
  }

  // Returns true if tourney is a Grand Slam, false otherwise.
  function is_grandslam(id) {
    return id === TOURNEY_ID.AUSTRALIAN_OPEN ||
      id === TOURNEY_ID.ROLAND_GARROS ||
      id === TOURNEY_ID.WIMBLEDON ||
      id === TOURNEY_ID.US_OPEN;
  }
  
  sheets.spreadsheets.values.get({
    spreadsheetId: ATP_SPREADSHEET_ID,
    range: ATP_SPREADSHEET_RANGE,
  }, (err, res) => {
    if (err) {
      return console.log('The API returned an error: ' + err);
    }

    const rows = res.data.values;

    if (rows.length) {
      console.log('Tourney, Year, Singles Winner');

      rows.map((row) => {
        const tourney_id = parseInt(row[ATP_SPREADSHEET_COLUMN_OFFSET.TOURNEY_ID], 10);
        
        if(is_grandslam(tourney_id)) {
          const tourney_year = row[ATP_SPREADSHEET_COLUMN_OFFSET.TOURNEY_YEAR];
          const singles_winner = row[ATP_SPREADSHEET_COLUMN_OFFSET.SINGLES_WINNER_NAME];

          console.log(`${get_tourney_name(tourney_id)}, ${tourney_year}, ${singles_winner}`);
        }
      });
    } else {
      console.log('No data found.');
    }
  });
}

module.exports = {
  makeAuthorizedCall,
};
