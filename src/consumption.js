let Util = require("./util");
const Subscription = require('./subscription')
const { ConsumptionManagementClient } = require("@azure/arm-consumption");

class Consumption {

  #token = "";
  #util = "";

  constructor(token) {
      this.#token = token;
      this.#util = new Util();
      return this;
  }

  listBudgets() {
    return new Promise(async (resolve, reject) => {

      try {
        const subscriptions = await new Subscription(this.#token).listSubscriptions()
        const result = new Array();

        for (const subs of subscriptions) {
          const scope = `subscriptions/${subs.subscriptionId}`;
          const client = new ConsumptionManagementClient(this.#token, subs.subscriptionId);
          
          for await (let item of client.budgets.list(scope)) {
            item.actualSpend = item.currentSpend.amount;
            item.unit = item.currentSpend.unit
            delete item.currentSpend;
            
            result.push(item);
          }
        }

        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }  

  getCredits(subscriptionId, billingAccountId, billingProfileId) {
    return new Promise(async (resolve, reject) => {

      try {
        const client = new ConsumptionManagementClient(this.#token, subscriptionId);
        const result = await client.credits.get(billingAccountId, billingProfileId)
        
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  } 

  listLots(subscriptionId, billingAccountId, billingProfileId) {
    return new Promise(async (resolve, reject) => {

      try {
        const client = new ConsumptionManagementClient(this.#token, subscriptionId);
        const result = new Array();

        for await (let item of client.lotsOperations.listByBillingProfile(billingAccountId, billingProfileId)) {
          result.push(item);
        }
        
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }  
    
}

module.exports = Consumption