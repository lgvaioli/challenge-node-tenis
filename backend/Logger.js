const mongoose = require('mongoose');
const { DB_STRING } = require('./config');

const MESSAGE_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};


// We couple the logger to Mongo just for simplicity's sake. In a real app
// we would be wiser to separate these two concerns into separate classes. There's
// no logical reason why the logger must know about the specific database we're using.
class Logger {
  constructor() {
    // Setup mongo
    this.connection = mongoose.createConnection(DB_STRING, {
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
    
    this.LogMessage = this.connection.model('LogMessage', LogMessageSchema);
  }

  logGeneric(message, type) {
    let typeStr = null;

    switch(type) {
      case MESSAGE_TYPE.SUCCESS:
      case MESSAGE_TYPE.WARNING:
      case MESSAGE_TYPE.ERROR:
        typeStr = type;
        break;

      default:
        throw new Error('invalid log message type');
    }

    const logMsg = new this.LogMessage({
      type: typeStr,
      message: message,
    });

    logMsg
      .save()
      .then(() => {
        console.log(`Successfully saved log message to database`);
      })
      .catch((err) => {
        console.log(`Could not save log message to database: ${err}`);
      })
  }

  logSuccess(message) {
    this.logGeneric(message, MESSAGE_TYPE.SUCCESS);
  }

  logWarning(message) {
    this.logGeneric(message, MESSAGE_TYPE.WARNING);
  }

  logError(message) {
    this.logGeneric(message, MESSAGE_TYPE.ERROR);
  }
}

module.exports = {
  Logger,
};
