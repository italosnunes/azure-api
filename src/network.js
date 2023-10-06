let Util = require("./util");
const ResourceGraph = require('./resourcegraph')
const { NetworkManagementClient } = require("@azure/arm-network");

class Network {

  #token = "";
  #util = "";

  constructor(token) {
    this.#token = token;
    this.#util = new Util();
    return this;
  }

  listNetworkInterfaces() {
    return new Promise(async (resolve, reject) => {

      try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Network/networkInterfaces'")

        resolve(result);
      } catch (err) {
        reject(err);
      }
      
    });
  }   
  
  listVirtualNetworks() {
    return new Promise(async (resolve, reject) => {

      try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Network/virtualNetworks'")

        resolve(result);
      } catch (err) {
        reject(err);
      }
      
    });
  }   

  listFirewallPolicies() {
    return new Promise(async (resolve, reject) => {

      try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Network/firewallPolicies'")

        resolve(result);
      } catch (err) {
        reject(err);
      }
      
    });
  }   

  listNatGateways() {
    return new Promise(async (resolve, reject) => {

      try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Network/natGateways'")

        resolve(result);
      } catch (err) {
        reject(err);
      }
      
    });
  }

  listNetworkSecurityGroups() {
    return new Promise(async (resolve, reject) => {

      try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Network/networkSecurityGroups'")

        resolve(result);
      } catch (err) {
        reject(err);
      }
      
    });
  }

  listRouteTables() {
    return new Promise(async (resolve, reject) => {

      try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Network/routeTables'")

        resolve(result);
      } catch (err) {
        reject(err);
      }
      
    });
  }

  listPrivateLinkServices() {
    return new Promise(async (resolve, reject) => {

      try {
        const result = await new ResourceGraph(this.#token).listResources("Resources | where type =~ 'Microsoft.Network/privateLinkServices'")

        resolve(result);
      } catch (err) {
        reject(err);
      }
      
    });
  }

  listSubnets() {
    return new Promise(async (resolve, reject) => {

      try {
        const virtualNetworks = await this.listVirtualNetworks()
        const result = new Array();

        for(const vn of virtualNetworks) {
          const client = new NetworkManagementClient(this.#token, vn.subscriptionId)
          for await (let item of client.subnets.list(vn.resourceGroup, vn.name)) {
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

module.exports = Network