let Util = require("./util");
const ResourceGraph = require('./resourcegraph')
const { StorageManagementClient } = require("@azure/arm-storage");

class Storage {

  #token = "";
  #util = "";

  constructor(token) {
    this.#token = token;
    this.#util = new Util();
    return this;
  }

  listStorageAccounts() {
    return new Promise(async (resolve, reject) => {

        try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Storage/storageAccounts'")

        resolve(result);
        } catch (err) {
        reject(err);
        }
      
    });
  }    

  listContainers() {
    return new Promise(async (resolve, reject) => {

        try {
            const storageAccounts = await this.listStorageAccounts()
            const result = new Array();

            for (const account of storageAccounts) {
                const client = new StorageManagementClient(this.#token, account.subscriptionId);
                for await (let item of client.blobContainers.list(account.resourceGroup, account.name)) {
                result.push(item);
                }
            }
            
            resolve(result);
        } catch (err) {
        reject(err);
        }
      
    });
  }

  listFileShares() {
    return new Promise(async (resolve, reject) => {

        try {
            const storageAccounts = await this.listStorageAccounts()
            const result = new Array();

            for (const account of storageAccounts) {
                const client = new StorageManagementClient(this.#token, account.subscriptionId);
                for await (let item of client.fileShares.list(account.resourceGroup, account.name)) {
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

module.exports = Storage