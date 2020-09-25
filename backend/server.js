require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');


// FIXME: Move config constants to a separate file.
const PORT = process.env.PORT || 3000;

const STATUS_CODE = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
};

// Static dir
const STATIC_DIR = 'frontend/build';

// Setup body parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Setup mongo. FIXME: Implement with Docker and move me to its own file.
/*
const connection = mongoose.createConnection(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const LogMessageSchema = new mongoose.Schema({
    type: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
});

const LogMessage = connection.model('LogMessage', LogMessageSchema);
*/


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
    // FIXME: Log warning/error to database

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
