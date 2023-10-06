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

  listDataDisks() {
    return new Promise(async (resolve, reject) => {

      try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Compute/disks' | where isnull(properties.osType)")

        resolve(result);
      } catch (err) {
        reject(err);
      }

    });
  }    

  listOSDisks() {
    return new Promise(async (resolve, reject) => {

      try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Compute/disks' | where isnotnull(properties.osType)")

        resolve(result);
      } catch (err) {
        reject(err);
      }

    });
  }    

}

module.exports = Compute