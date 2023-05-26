const { DataPageOptions } = require("../types/DataPageTypes");

class DataPage {
  /**
   *
   * @param {String} accountID
   * @param {String} appKeyPrefix
   * @param {String} appKey
   * @param {DataPageOptions} options
   */
  constructor(accountID, appKeyPrefix, appKey, options) {
    this.accountID = accountID;
    this.appKeyPrefix = appKeyPrefix;
    this.appKey = appKey;
    this.fullAppKey = this.appKeyPrefix + this.appKey;
    this.cbDomain = "https://" + this.accountID + ".caspio.com";
    this.cbDataPagePrefix = this.cbDomain + "/dp/" + this.appKeyPrefix;
    this.options = {
      DataPageOptions,
      ...options,
    };
    this.src = this.cbDataPagePrefix + this.appKey + "/emb"; //deployment method is always script tag

    if (this.options.deploy) {
      logger.log("Deploying DataPage: " + this.appKeyPrefix + this.appKey);
      if (this.options.getParamsOnInit) {
      }
      this.deploy(this.options.containerSel, this.options.params);
    }
  }
  static getDPManagerInstance(appKey) {
    for (var key in window.dataPageManagerObj.dataPages) {
      if (key.search(appKey) != -1) {
        return window.dataPageManagerObj.dataPages[key];
      }
    }
    return;
  }
  getDPManagerInstance() {
    const instance = this;
    for (var key in window.dataPageManagerObj.dataPages) {
      if (key.search(instance.appKeyPrefix + this.appKey) != -1) {
        return window.dataPageManagerObj.dataPages[key];
      }
    }
    return;
  }
  getDPObjectInstance() {
    return this.getDPManagerInstance()["dataPageObj"];
  }
  /**
   *
   * @returns {HTMLScriptElement}
   */
  getScriptElement() {
    if (this.options.deploy) {
      if (this.options.containerSel) {
        const scriptEl = document.querySelector(`${this.options.containerSel} > script`);
        return scriptEl;
      }
    }
    return;
  }
  updateDeploymentParams(paramString) {
    this.getScriptElement().setAttribute("src", this.src + paramString);
  }

  deploy(containerSel, paramString) {
    let params = paramString || "";
    let dataPageScript = document.createElement("script");
    let container = document.querySelector(containerSel ?? this.options.containerSel); //should be specific selector

    if (!container) {
      throw new Error(`Container ${containerSel ?? this.options.containerSel} not found!`);
    }

    dataPageScript.src = this.cbDataPagePrefix + this.appKey + "/emb" + params;

    container.innerHTML = "";
    container.appendChild(dataPageScript);

    return dataPageScript;
  }
  refresh() {
    const dpmi = this.getDPManagerInstance();
    if (dpmi) {
      dpmi.refresh();
      return true;
    }
    return false;
  }
  on(event, callback) {
    const instance = this;
    if (event === "DataPageReady") {
      document.addEventListener("DataPageReady", function (e) {
        callback(instance, e);
      });
    }
  }
  ready(callback) {
    const instance = this;
    document.addEventListener("DataPageReady", callback);
  }
}

module.exports = DataPage;
