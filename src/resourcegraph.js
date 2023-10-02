let Util = require("./util");
const { ResourceGraphClient } = require("@azure/arm-resourcegraph");

class ResourceGraph {

    #token = "";
    #util = "";

    constructor(token) {
        this.#token = token;
        this.#util = new Util();
        return this;
    }

    listResources(resource) {
        return new Promise(async (resolve, reject) => {

          try {
            const query = {
              query: `Resources | where type =~ '${resource}'`
            }
            const client = new ResourceGraphClient(this.#token);
            var result = await client.resources(query)
            
            resolve(result.data);
          } catch (err) {
            reject(err);
          }
        });
    }    
      
}

module.exports = ResourceGraph