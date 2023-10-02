let Util = require("./util");
const { BillingManagementClient } = require("@azure/arm-billing");

class Billing {

  #token = "";
  #util = "";

  constructor(token) {
      this.#token = token;
      this.#util = new Util();
      return this;
  }

  listBillingAccounts(subscriptionId) {
      return new Promise(async (resolve, reject) => {

        try {
          const result = new Array();
          const client = new BillingManagementClient(this.#token, subscriptionId);
          
          for await (let item of client.billingAccounts.list()) {
            result.push(item);
          }

          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
  }   

  listBillingProfiles(subscriptionId, billingAccountName) {
    return new Promise(async (resolve, reject) => {

      try {
        const result = new Array();
        const client = new BillingManagementClient(this.#token, subscriptionId);

        for await (let item of client.billingProfiles.listByBillingAccount(billingAccountName)) {
          result.push(item);
        } 

        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  listBillingSubscriptions(billingAccountName) {
    return new Promise(async (resolve, reject) => {

      try {
        const result = new Array();
        const client = new BillingManagementClient(this.#token, subs.subscriptionId);

        for await (let item of client.billingSubscriptions.listByBillingAccount(billingAccountName)) {
          result.push(item);
        }
            
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }    
      
}

module.exports = Billing