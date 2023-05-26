const DataPage = require("./DataPage");

const TABULAR_DPO_TEMPLATE = {
  pageState: {
    size: null, //set record per page
  },
  totalRecords: null,
  totalPageCount: null,
  totalDataRowCount: null,
};
class TabularReport extends DataPage {
  constructor(accountID, appKeyPrefix, appKey, options) {
    super(accountID, appKeyPrefix, appKey, options);
  }
}

module.exports = TabularReport;
