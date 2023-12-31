let Util = require("./util");
const ResourceGraph = require('./resourcegraph')

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
            const result = await new ResourceGraph(this.#token).listResources("resourcecontainers | where type =~ 'microsoft.resources/subscriptions/resourcegroups'")

            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
    }  
      
}

module.exports = Resource