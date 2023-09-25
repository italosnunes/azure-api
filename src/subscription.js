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
}

module.exports = Subscription