const { ClientSecretCredential } = require('@azure/identity')
var Subscription = require('./subscription')
var CostManagement = require('./costmanagement')
var Consumption = require('./consumption')
var Compute = require('./compute')
var Resource = require('./resource')
var Billing = require('./billing')
var ResourceGraph = require('./resourcegraph')
var ResourceHealth = require('./resourcehealth')
var Advisor = require('./advisor')
var Network = require('./network')
var Storage = require('./storage')
var Kubernetes = require('./kubernetes')

module.exports = class azure {

    #console = console;
    #client_id = "";
    #tenant_id = "";
    #client_secret = "";
    #token = "";

    constructor(config) {
        this.#client_id = config.AZURE_CLIENT_ID;
        this.#tenant_id = config.AZURE_TENANT_ID;
        this.#client_secret = config.AZURE_CLIENT_SECRET;

        return new Promise(async(resolve, reject) => {
            try {
                /**
                * Autentica o Usuário
                */
                this.#token = await new ClientSecretCredential(this.#client_id, this.#tenant_id, this.#client_secret)

                /**
                * Retorna
                */
                resolve(this)
            } catch (error) {
                reject(error)
            }
            
        })
        
    }

    #disableConsole() {
        console = {
            log: function () { },
            error: function () { },
            info: function () { },
            warn: function () { }
        }
    }

    #enableConsole() {
        console = this.#console;
    }

    listSubscriptions() {
        return new Subscription(this.#token).listSubscriptions();
    }

    listSubscriptionsCredits() {
        return new Subscription(this.#token).listSubscriptionsCredits()
    }

    listAccountCostsByServicesFromLast12Months() {
        return new CostManagement(this.#token).listAccountCostsByServicesFromLast12Months();
    }

    listAccountCostsFromLast12Months() {
        return new CostManagement(this.#token).listAccountCostsFromLast12Months()
    }

    getActualYearTotalUsage() {
        return new CostManagement(this.#token).getActualYearTotalUsage()
    }

    listAccountCostsByRegionsFromLast12Months() {
        return new CostManagement(this.#token).listAccountCostsByRegionsFromLast12Months()
    }

    last3MTotalSpent() {
        return new CostManagement(this.#token).last3MTotalSpent()
    }

    listBudgets() {
        return new Consumption(this.#token).listBudgets()
    }

    getCredits() {
        return new Consumption(this.#token).getCredits()
    }

    listLots() {
        return new Consumption(this.#token).listLots()
    }

    listVirtualMachines() {
        return new Compute(this.#token).listVirtualMachines()
    }

    listDataDisks() {
        return new Compute(this.#token).listDataDisks()
    }

    listOSDisks() {
        return new Compute(this.#token).listOSDisks()
    }

    listResourceGroups() {
        return new Resource(this.#token).listResourceGroups()
    }

    listBillingAccounts() {
        return new Billing(this.#token).listBillingAccounts()
    }

    listBillingSubscriptions() {
        return new Billing(this.#token).listBillingSubscriptions()
    }

    listBillingProfiles() {
        return new Billing(this.#token).listBillingProfiles()
    }

    listResources(resource) {
        return new ResourceGraph(this.#token).listResources(resource)
    }

    listEvents() {
        return new ResourceHealth(this.#token).listEvents()
    }

    listEmergingIssues() {
        return new ResourceHealth(this.#token).listEmergingIssues()
    }

    listRecommendations() {
        return new Advisor(this.#token).listRecommendations()
    }

    listVirtualNetworks() {
        return new Network(this.#token).listVirtualNetworks()
    }

    listFirewalls() {
        return new Network(this.#token).listFirewalls()
    }

    listFirewallPolicies() {
        return new Network(this.#token).listFirewallPolicies()
    }

    listNatGateways() {
        return new Network(this.#token).listNatGateways()
    }

    listNetworkInterfaces() {
        return new Network(this.#token).listNetworkInterfaces()
    }

    listNetworkSecurityGroups() {
        return new Network(this.#token).listNetworkSecurityGroups()
    }

    listRouteTables() {
        return new Network(this.#token).listRouteTables()
    }

    listPrivateLinkServices() {
        return new Network(this.#token).listPrivateLinkServices()
    }

    listSubnets() {
        return new Network(this.#token).listSubnets()
    }

    listStorageAccounts() {
        return new Storage(this.#token).listStorageAccounts()
    }

    listContainers() {
        return new Storage(this.#token).listContainers()
    }

    listFileShares() {
        return new Storage(this.#token).listFileShares()
    }

    listClusters() {
        return new Kubernetes(this.#token).listClusters()
    }
}