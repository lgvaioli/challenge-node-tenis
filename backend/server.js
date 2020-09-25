const express = require('express');
const app = express();
const { getClientIp } = require('request-ip');
const { PORT, STATUS_CODE, STATIC_DIR } = require('./config');
const { Logger } = require('./logger');
const logger = new Logger();


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

  // FIXME: Implement actual behavior, maybe through an AtpSheet class.
  return res
    .status(STATUS_CODE.OK)
    .json({ fixme: `implement me! Here's your tourneyId: ${tourneyId}`});
});


// Put server to listen. Extra newlines to make it easier to spot in docker logs
console.log(`\n\nServer listening at http://localhost:${PORT}\n\n`);
app.listen(PORT);
