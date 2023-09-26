let Util = require("./util");
const Subscription = require('./subscription')
const { ResourceManagementClient } = require("@azure/arm-resources");

class Resource {

    #token = "";
    #util = "";

    constructor(token) {
        this.#token = token;
        this.#util = new Util();
        return this;
    } 

    listResourceGroups() {
        return new Promise(async (resolve, reject) => {

          try {
            const subscriptions = await new Subscription(this.#token).listSubscriptions()
            const result = new Array();

            for (const subs of subscriptions) {
              const client = new ResourceManagementClient(this.#token, subs.subscriptionId);
              
              for await (let item of client.resourceGroups.list()) {
                
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

module.exports = Resource