const DataPage = require("./DataPage");

class Details extends DataPage {
  constructor(accountID, appKeyPrefix, appKey, options) {
    super(accountID, appKeyPrefix, appKey, options);
  }
}

module.exports = Details;
