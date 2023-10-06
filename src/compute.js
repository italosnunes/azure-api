let Util = require("./util");
const ResourceGraph = require('./resourcegraph')

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
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Compute/virtualMachines'")

        resolve(result);
      } catch (err) {
        reject(err);
      }
      
    });
  }

  listDisks() {
    return new Promise(async (resolve, reject) => {

      try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Compute/disks'")

        resolve(result);
      } catch (err) {
        reject(err);
      }

    });
  }    

}

module.exports = Compute