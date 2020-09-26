const { google } = require('googleapis');
const { getAuthClient } = require('./auth');

const ATP_SPREADSHEET_ID = '1GZu4w8_NiJS8I1--C-N5O2dPoj_Bv-ojekMRDS2ToMQ';

// FIXME: Inefficient, we're getting lots of data we don't use. Optimize me!
const ATP_SPREADSHEET_RANGE = 'tournaments_1877-2017_unindexed_csv!A2:P';

const ATP_SPREADSHEET_COLUMN_OFFSET = {
  TOURNEY_YEAR: 0,
  TOURNEY_ID: 3,
  SINGLES_WINNER_NAME: 15,
}

// We couple the AtpSheet representation to the Google auth mechanism just for
// simplicity's sake. In a real app these two concerns should be separated.
class AtpSheet {
  constructor(logger) {
    this.authClient = getAuthClient();
    this.logger = logger;
  }

  // Helper function. Adds a player win to a tourney object of the form [ { player: {}, wins: [] } ].
  // If the player already exists, it just adds the year to the wins array. Otherwise, it adds both
  // the player and the year.
  _tourneyAddWin(tourney, player, year) {
    let playerFound = false;

    for (let i = 0; i < tourney.length; i++) {
      const currWinEntry = tourney[i];

      if (currWinEntry.player === player) {
        playerFound = true;
        currWinEntry.wins.push(year);
        break;
      }
    }

    if (!playerFound) {
      // New player, add entire win entry to the tourney
      const wins = [];
      wins.push(year);

      const winEntry = {
        player,
        wins,
      };

      tourney.push(winEntry);
    }
  }

  // Helper function. Returns the win entry { player: {}, wins: [] } with most singles won.
  _tourneyFindMostSingles(tourney) {
    let currentMax = -1;
    let currentMaxWinEntry = null;

    for (let i = 0; i < tourney.length; i++) {
      const currentWinEntry = tourney[i];
      const currentWins = currentWinEntry.wins;

      if (currentWins.length > currentMax) {
        currentMax = currentWins.length;
        currentMaxWinEntry = currentWinEntry;
      }
    }

    return currentMaxWinEntry;
  }

  // Returns a promise which resolves to an object of the form { player: 'Roger Federer', wins: [1994, 1996, 2004] },
  // with the player with most singles won in the tourney with id tourneyId.
  getMostSinglesPlayer(tourneyId) {
    return new Promise((resolve, reject) => {
      const sheets = google.sheets({ version: 'v4', auth: this.authClient });
    
      sheets.spreadsheets.values.get({
        spreadsheetId: ATP_SPREADSHEET_ID,
        range: ATP_SPREADSHEET_RANGE,
      }, (err, res) => {
        if (err) {
          this.logger.logError(`Google Sheets API returned an error: ${err}`);
          return;
        }

        this.logger.logSuccess(`Got ATP sheet`);
  
        const rows = res.data.values;
  
        if (rows.length) {
          let tourney = [];
  
          rows.forEach((row) => {
            const currentTourneyId = parseInt(row[ATP_SPREADSHEET_COLUMN_OFFSET.TOURNEY_ID], 10);
  
            if (currentTourneyId !== tourneyId) {
              return;
            }
  
            const tourneyYear = row[ATP_SPREADSHEET_COLUMN_OFFSET.TOURNEY_YEAR];
            const singlesWinner = row[ATP_SPREADSHEET_COLUMN_OFFSET.SINGLES_WINNER_NAME];
  
            this._tourneyAddWin(tourney, singlesWinner, tourneyYear);
          });
  
          return resolve(this._tourneyFindMostSingles(tourney));
        } else {
          const errMsg = `Didn't get any rows from spreadsheet`;
          this.logger.logWarning(errMsg);
          return reject(errMsg);
        }
      });
    });
  }
}

module.exports = {
  AtpSheet,
};
