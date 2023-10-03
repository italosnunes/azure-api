const { ClientSecretCredential } = require('@azure/identity')
var Subscription = require('./subscription')
var CostManagement = require('./costmanagement')
var Consumption = require('./consumption')
var Compute = require('./compute')
var Resource = require('./resource')
var Billing = require('./billing')
var ResourceGraph = require('./resourcegraph')
var ResourceHealth = require('./resourcehealth')

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

    listDisks() {
        return new Compute(this.#token).listDisks()
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
}