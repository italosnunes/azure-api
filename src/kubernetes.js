let Util = require("./util");
const ResourceGraph = require('./resourcegraph')

class Kubernetes {

  #token = "";
  #util = "";

  constructor(token) {
    this.#token = token;
    this.#util = new Util();
    return this;
  }

  listClusters() {
    return new Promise(async (resolve, reject) => {

      try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Containerservice/managedClusters'")

        resolve(result);
      } catch (err) {
        reject(err);
      }
      
    });
  }     

}

module.exports = Kubernetes