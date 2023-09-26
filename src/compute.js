let Util = require("./util");
const Subscription = require('./subscription')
const Resource = require('./resource')
const { ComputeManagementClient } = require("@azure/arm-compute");

class Compute {

    #token = "";
    #util = "";

    constructor(token) {
        this.#token = token;
        this.#util = new Util();
        return this;
    }

    listVirtualMachines() {
        return new Promise(async (resolve, reject) => {

          try {
            const subscriptions = await new Subscription(this.#token).listSubscriptions()
            const result = new Array();

            for (const subs of subscriptions) {
                const client = new ComputeManagementClient(this.#token, subs.subscriptionId);
                var resourceGroups = await new Resource(this.#token).listResourceGroups() 
                
                for (const rg of resourceGroups) {
                    for await (let item of client.virtualMachines.list(rg.name)) {
                    
                        result.push(item);
                    }
                }
                
            }

            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
    }   

    listDisks() {
        return new Promise(async (resolve, reject) => {

          try {
            const subscriptions = await new Subscription(this.#token).listSubscriptions()
            const result = new Array();

            for (const subs of subscriptions) {
                const client = new ComputeManagementClient(this.#token, subs.subscriptionId);
          
                for await (let item of client.disks.list()) {
                
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

module.exports = Compute