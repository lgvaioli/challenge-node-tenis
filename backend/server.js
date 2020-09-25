const express = require('express');
const app = express();
const { getClientIp } = require('request-ip');
const { PORT, STATUS_CODE, STATIC_DIR } = require('./config');
const { Logger } = require('./Logger');
const logger = new Logger();
const { AtpSheet } = require('./AtpSheet');
const atpSheet = new AtpSheet(logger);


// Setup body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Setup Express middleware
app.use(express.static(STATIC_DIR));


// Setup routes
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: STATIC_DIR });
});

// Most singles endpoint. Returns info about the player who won the most singles in a given
// tourney.
// User must POST a valid tourneyId (int) in the body.
// Returns a JSON of the following form: { player: 'Roger Federer', wins: [1994, 1997, 2000] } on
// success or a 400 BAD REQUEST of the form { reason: 'invalid tourney id' }.
app.post('/atpstats/mostSingles', (req, res) => {
  const tourneyId = parseInt(req.body.tourneyId, 10);

  if (isNaN(tourneyId)) {
    logger.logWarning(`Got invalid tourneyId from ${getClientIp(req)}`);

    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ reason: 'invalid tourneyId' });
  }

  atpSheet
    .getMostSinglesPlayer(tourneyId)
    .then((playerWins) => {
      logger.logSuccess(`Got most singles for tourneyId ${tourneyId} for ${getClientIp(req)}`);

      return res
        .status(STATUS_CODE.OK)
        .json({ ...playerWins });
    })
    .catch((err) => {
      logger.logError(`Error while trying to get most singles for tourneyId ${tourneyId} for ${getClientIp(req)}: ${err}`);

      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ reason: err });
    })
});


// Put server to listen. Extra newlines to make it easier to spot in docker logs
console.log(`\n\nServer listening at http://localhost:${PORT}\n\n`);
app.listen(PORT);
