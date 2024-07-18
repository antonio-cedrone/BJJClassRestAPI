class ErrorWithInfo extends Error {
    headerInfo
    constructor(message) {
      super(message);
    }
}

module.exports = ErrorWithInfo;