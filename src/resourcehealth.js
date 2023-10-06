let Util = require("./util");
const Subscription = require('./subscription')
const { MicrosoftResourceHealth } = require("@azure/arm-resourcehealth");

class ResourceHealth {

    #token = "";
    #util = "";

    constructor(token) {
        this.#token = token;
        this.#util = new Util();
        return this;
    }

    listEvents() {
        return new Promise(async (resolve, reject) => {

          try {
            const subscriptions = await new Subscription(this.#token).listSubscriptions()
            const result = new Array();

            for (const subs of subscriptions) {
                const client = new MicrosoftResourceHealth(this.#token, subs.subscriptionId);
                for await (let item of client.eventsOperations.listBySubscriptionId()) {
                    result.push(item);
                }
            }

            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
    }    

    listEmergingIssues() {
        return new Promise(async (resolve, reject) => {

          try {
            const subscriptions = await new Subscription(this.#token).listSubscriptions()
            const result = new Array();

            for (const subs of subscriptions) {
                const client = new MicrosoftResourceHealth(this.#token, subs.subscriptionId);
                for await (let item of client.emergingIssues.list()) {
                    result.push(item);
                }
            }

            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
    }  
      
}

module.exports = ResourceHealth