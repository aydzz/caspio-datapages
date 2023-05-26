const DataPage = require("./DataPage");
const $ = require("jquery");
/**
 * Created for Pivot Report Customization in a specific use case.
 *
 * CREATED: 05/24/2023 - caspaul
 * UPDATE: -
 */

const DEFAULT_OPTIONS = {
  sample: "",
};

class PivotReport extends DataPage {
  /**
   *
   * @param {String} container
   * @param {DEFAULT_OPTIONS} options
   */
  constructor(accountID, appKeyPrefix, appKey, options) {
    super(accountID, appKeyPrefix, appKey, options);
  }

  /**
   * Gets the Grouping count based on the .cbResultSetGroup count before the first .cbResultSetOddRow
   * @returns {Number}
   */
  getRowGroupingCount() {
    //@FIX: when collapsed, the collapsed grouping is being counted.
    return $(".cbResultSetOddRow")[0] && $($(".cbResultSetOddRow")[0]).prevAll("tr[class*='cbResultSetGroup']").length;
  }

  getRowGroups(options) {
    const opts = {
      //Selectors for the group
      groupNum: null,
      groupSelector: null,

      //Selector for the After ROW
      afterRow: {
        element: null,
        index: null,
      },
      beforeRow: {
        element: null,
        index: null,
      },
      ...options,
    };
    const { groupNum, groupSelector, afterRow, beforeRow } = opts;

    //Throwables
    if (groupNum && groupSelector) throw new Error("Cannot use both groupNumber and groupSelector");
    if (afterRow.element && afterRow.index) throw new Error("Cannot use both rowElement and rowIndex");
    if (beforeRow.element && beforeRow.index) throw new Error("Cannot use both rowElement and rowIndex");
    if (((afterRow.index ?? -1) >= 0 && (beforeRow.index ?? -1) >= 0) || (afterRow.element && beforeRow.element)) {
      const beforeIndex = beforeRow.index >= 0 ? beforeRow.index : $(beforeRow.element).prop("rowIndex");
      const afterIndex = afterRow.index >= 0 ? afterRow.index : $(afterRow.element).prop("rowIndex");
      if (beforeIndex < afterIndex) throw new Error("Invalid range for rows");
    }

    //logic starts here
    let rowGroups = $(`${opts.groupNum ? `${this.options.containerSel} tr.cbResultSetGroup${opts.groupNum}Row` : opts.groupSelector}`);
    let afterRowIndex = null;
    let beforeRowIndex = null;

    //min row index
    if (opts.afterRow.element || (opts.afterRow.index >= 0 && opts.afterRow.index)) {
      if (opts.afterRow.element) {
        afterRowIndex = ($(opts.afterRow.element).length && $(opts.afterRow.element).prop("rowIndex")) || null;
      }
      if (opts.afterRow.index) {
        afterRowIndex = opts.afterRow.index;
      }
    }

    //max row index
    if (opts.beforeRow.element || (opts.beforeRow.index >= 0 && opts.beforeRow.index)) {
      if (opts.afterRow.element) {
        beforeRowIndex = ($(opts.beforeRow.element).length && $(opts.beforeRow.element).prop("rowIndex")) || null;
      }
      if (opts.beforeRow.index) {
        beforeRowIndex = opts.beforeRow.index;
      }
    }

    if (afterRowIndex >= 0 && beforeRowIndex === null) {
      rowGroups = $(rowGroups).filter(function (i, el) {
        if ($(el).prop("rowIndex") > afterRowIndex) {
          return true;
        }
        return false;
      });
    } else if (afterRowIndex === null && beforeRowIndex >= 0) {
      rowGroups = $(rowGroups).filter(function (i, el) {
        if ($(el).prop("rowIndex") < beforeRowIndex) {
          return true;
        }
        return false;
      });
    } else if (afterRowIndex >= 0 && beforeRowIndex >= 0) {
      rowGroups = $(rowGroups).filter(function (i, el) {
        if ($(el).prop("rowIndex") > afterRowIndex && $(el).prop("rowIndex") < beforeRowIndex) {
          return true;
        }
        return false;
      });
    }

    return rowGroups;
  }

  getHeaders(options) {
    const opts = {
      headerNum: null,
      ...options,
    };

    if (!opts.headerNum) throw new Error("Invalid header selector | options");

    return $(`${this.options.containerSel} .cbResultSetTableHeader:nth-of-type(${opts.headerNum})`);
  }
  getHeaderCollapsibles(headerNum) {
    const headers = this.getHeaders({ headerNum: headerNum });
    const headerCollapsibles = $(headers).find("span[id*='ColumnGroup'] img[alt='expand icon']").closest("th.cbResultSetLabel.cbResultSetHeaderCell");
    return headerCollapsibles;
  }

  /**
   * Hides the column of a pivot table which should also reflect the row/col grouping if there  is any.
   * @param {Number} col
   * @param {Object} options
   */
  hideColumn(col, options) {
    const opt = {
      withRowGroup: false, //Column with Row Grouping
      withColGroup: false, //Column with Column Grouping @TODO
      ...options,
    };

    if (opt.withRowGroup) {
      this.hideRowGroup(col);
    }

    $(`${this.options.containerSel} table.cbResultSetTable th:nth-of-type(${col})`).css("display", "none");
    $(`${this.options.containerSel} table.cbResultSetTable td:nth-of-type(${col})`).css("display", "none");

    return this;
  }
  /**
   * Used to hide row with grouping
   *  - Hiding group only makes sense if we are to hide grouped rows so we can target row with specific selector and with specific funcitonality
   * @param {Array<HTMLTableRowElement>} rowGroups
   * @param {Object} options
   */
  hideRowGroup(rowGroups) {
    $(rowGroups).each(function (i, el) {
      $(el).css("display", "none");
    });

    return this;
  }
  /**
   * @TODO
   * Lifts full row content or grouped/aggregated values to a specific parent row.
   *  - This is used to flatten pivot table with multiple grouping without the need for target's aggregated values
   * @param {} from
   * @param {*} to
   */
  liftGroupContent(from, to) {
    //do something here...
  }

  /**
   * @param {Number} from Source Row group number
   * @param {*} to Destination Row Group number
   */
  liftRowGroupLabels(from, to) {
    const levels = from - to;
    const srcGroupRows = $(`tr.cbResultSetGroup${from}Row`);
    const destGroupRows = $(`tr.cbResultSetGroup${to}Row`);

    //Throwables
    if (levels < 0) throw new Error("Unable to lift below the target level.");
    if (srcGroupRows.length !== destGroupRows.length) throw new Error("Destination and Source Row count does not match.");
    if (this.getRowGroupingCount() > 4) console.warn("Grouping exceeded the grouping limit."); //@TODO - handling current class index logic is cumbersome.

    srcGroupRows.each(function (i, row) {
      $(row)
        .find(`.cbResultSetGroup${from}Label.cbResultSetGroup${from}LabelCell`)
        .each(function (j, labelCell) {
          $(destGroupRows[i])
            .find(`td:eq(${$(labelCell).prop("cellIndex")})`)
            .replaceWith($.parseHTML($(labelCell).prop("outerHTML").toString()));
        });
    });

    return this;
  }
  /**
   * Used to hide row with grouping
   *  - Hiding group only makes sense if we are to hide grouped rows so we can target row with specific selector and with specific funcitonality
   * @param {Array<HTMLTableRowElement>} rowGroups
   * @param {Object} options
   */
  modifyRowGroup(rowGroups, options) {
    const opts = {
      color: null,
      hideCollapsible: false,
      ...options,
    };
    $(rowGroups).each(function (i, el) {
      if (opts.color) {
        $(el).find("td").css("background", opts.color);
      }
      if (opts.hideCollapsible) {
        $(el).find("span > img").css("display", "none");
      }
    });

    return this;
  }
  /**
   * Primarily used to hide totals in data cell using specific string.
   * @param {"collapsed" | "uncollapsed" } mode
   * @param {String} value
   */
  replaceDataCellTotalValue(mode, value) {
    const expandIcons = $("th span[id*='ColumnGroup'] img[alt='expand icon']");
    const instance = this;
    expandIcons.each(function (i, icon) {
      const hideIndex = $(icon).closest("span[id*='ColumnGroup']").parent().prop("cellIndex");
      $(`${instance.options.containerSel} tr[class*='cbResultSet'][data-cb-name='data'] td:nth-of-type(${hideIndex + 1})`).text(value);
    });

    return this;
  }
}

module.exports = PivotReport;

/**
 * Notes
 *   20230523:
 *      - ideal for pivot reports that will surely display all rows ( few or known grouping criteria)
 * LIMIT:
 *  20230523:
 *      - grouping should be capped to 4 row groups. Caspio's behavior is that, the grouping count resets to 1 after 4 ( istead of continuing to increment in the DOM Classes )
 */
