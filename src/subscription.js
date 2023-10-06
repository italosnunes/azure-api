let Util = require("./util");
const { SubscriptionClient } = require("@azure/arm-subscriptions")

class Subscription {

    #token = "";
    #util = "";

    constructor(token) {
        this.#token = token;
        this.#util = new Util();
        return this;
    }

    listSubscriptions() {
        return new Promise(async (resolve, reject) => {

            try {
                const client = new SubscriptionClient(this.#token);
                var subscriptions = []

                for await (const item of client.subscriptions.list()) {
                    const subscriptionDetails = await client.subscriptions.get(
                      item.subscriptionId
                    );
                    subscriptions.push(subscriptionDetails)
                }

                resolve(subscriptions)
            } catch (error) {
                reject(error)
            }
        })
    }

    listSubscriptionsCredits() {
        return new Promise(async (resolve, reject) => {
            const Consumption = require('./consumption')
            const Billing = require('./billing')
            const CostManagement = require('./costmanagement')
            
            try {
                const subscriptions = await this.listSubscriptions()
                for (const subs of subscriptions) {
                    const billingAccounts = await new Billing(this.#token).listBillingAccounts(subs.subscriptionId);

                    for (const account of billingAccounts) {
                        const billingProfiles = await new Billing(this.#token).listBillingProfiles(subs.subscriptionId, account.name)
                        for (const profile of billingProfiles) {
                            subs.credits = await new Consumption(this.#token).getCredits(subs.subscriptionId, account.name, profile.name);
                            subs.lots = await new Consumption(this.#token).listLots(subs.subscriptionId, account.name, profile.name)
                        }
                    }

                    subs.serviceName = subs.lots[0].source
                    subs.timeStart = subs.lots[0].startDate
                    subs.timeEnd = subs.lots[0].expirationDate
                    subs.totalValue = subs.credits.balanceSummary.currentBalance.value * subs.credits.balanceSummary.estimatedBalanceInBillingCurrency.exchangeRate
                    subs.availableAmount = subs.credits.balanceSummary.estimatedBalanceInBillingCurrency.value
                    subs.currentSpent = subs.totalValue - subs.availableAmount
                    let lastThreeMonthsCost = await new CostManagement(this.#token).last3MTotalSpent(subs.subscriptionId)
                    let media = (lastThreeMonthsCost / 3)
                    subs.estimatedDaysToCreditsToRunOut = Math.ceil((subs.availableAmount / media) * 31)
                    let currentDate = new Date()
                    subs.estimatedDateToCreditToRunOut = new Date(currentDate.getTime() + subs.estimatedDaysToCreditsToRunOut * 24 * 60 * 60 * 1000)
                }
                
                resolve(subscriptions)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = Subscription