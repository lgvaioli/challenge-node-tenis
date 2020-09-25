const axios = require('axios').default;

// FIXME: Move this into a common config file shared with the backend.
// If the server changes the endpoint, and we don't update the value here, we're in trouble.
const MOST_SINGLES_ENDPOINT = '/atpstats/mostSingles';

export class AtpStatsApi {
  // Gets player with most won singles. Returns a promise which resolves to an object
  // { player: 'Name', wins: [1994, 1995] } on success, or rejects with an error.
  static getMostSingles(tourneyId) {
    return new Promise((resolve, reject) => {
      axios
      .post(MOST_SINGLES_ENDPOINT, { tourneyId })
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return reject(err);
      })
    });
  }
}
