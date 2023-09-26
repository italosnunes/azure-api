const { ClientSecretCredential } = require('@azure/identity')
var Subscription = require('./subscription')
var CostManagement = require('./costmanagement')
var Consumption = require('./consumption')
var Compute = require('./compute')
var Resource = require('./resource')

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

    listBudgets() {
        return new Consumption(this.#token).listBudgets()
    }

    listVirtualMachines() {
        return new Compute(this.#token).listVirtualMachines()
    }

    listResourceGroups() {
        return new Resource(this.#token).listResourceGroups()
    }

}