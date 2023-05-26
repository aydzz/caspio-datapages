const DataPage = require("./DataPage");
const $ = require("jquery");

class ChartDatapage extends DataPage {
  constructor(accountID, appKeyPrefix, appKey, options) {
    super(accountID, appKeyPrefix, appKey, options);
  }

  /**
   * Highchart does not load on DataPageReady event
   * @param {String} containerSels Jquery Selector if the container
   * @param {Function} callback Load Effect
   *
   * Best used in an interval
   */
  static chartLoadedIn(containerSels, callback) {
    if (window.Highcharts && window.Highcharts.charts) {
      window.Highcharts.charts.filter(function (chart) {
        for (let i = 0; i < containerSels.length; i++) {
          if ($(containerSels[i]).find($(chart.container)).length) {
            callback(chart);
          }
        }
      });
    }
  }

  /**
   * Get Highchart instance inside a container
   * Chart should be loaded before using this.
   * @param {String} containerSels Jquery Selector if the container
   */
  static getChartsIn(containerSels) {
    const charts = new Map();
    if (window.Highcharts && window.Highcharts.charts) {
      window.Highcharts.charts.forEach(function (chart) {
        for (let i = 0; i < containerSels.length; i++) {
          if ($(containerSels[i]).find($(chart.container)).length) {
            charts.set(containerSels[i], chart);
          }
        }
      });
    }

    return charts;
  }

  /**
   *
   * @param {String} containerSel selector string
   * @returns {any} Chart Instance
   */
  static getChartIn(containerSel) {
    return Array.from(ChartDatapage.getChartsIn([containerSel]).values())[0];
  }

  /**
   *
   * @param {Array<String>} containerSels
   * @param {Number} freq
   */
  static async waitForChartsIn(containerSels, freq = 100) {
    const interval = setInterval(function () {
      //do something here...
    }, freq);

    return;
  }
}

module.exports = ChartDatapage;
