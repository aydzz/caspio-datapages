const DataPage = require("./DataPage");

class SubmissionForm extends DataPage {
  constructor(accountID, appKeyPrefix, appKey, options) {
    super(accountID, appKeyPrefix, appKey, options);
  }
}

module.exports = SubmissionForm;
