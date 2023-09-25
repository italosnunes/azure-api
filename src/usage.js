let Util = require("./util");
const { CostManagementClient } = require("@azure/arm-costmanagement");
const Subscription = require("./subscription")

class Usage {

    #token = "";
    #util = "";

    constructor(token) {
        this.#token = token;
        this.#util = new Util();
        return this;
    }

    #calcImprovement(currentMonth, lastMonth) {
        let improvement = 0;
        if (currentMonth !== 0 && lastMonth !== 0) {
          improvement = (currentMonth - lastMonth) / lastMonth * 100;
        } else if (currentMonth === 0 && lastMonth === 0) {
          improvement = 0;
        } else if (lastMonth === 0) {
          improvement = 100;
        } else {
          improvement = -100;
        }
    
        return improvement;
    }

    listAccountCostsByServicesFromLast12Months() {
        return new Promise(async (resolve, reject) => {

            try {
                const subscriptions = await new Subscription(this.#token).listSubscriptions()
                var costs = []
                for(const subs of subscriptions) {
                    var today = new Date();
                    var year = today.getFullYear();
                    var month = today.getMonth() + 1
                    var monthEnd = new Date(year, month, 1)
                    var monthStart = new Date(year, month - 11, 1)
                    
                    const scope = `subscriptions/${subs.subscriptionId}`;
                    const parameters = {
                        type: "ActualCost",
                        dataset: {
                            aggregation: { totalCost: { name: "Cost", function: "Sum" } },
                            granularity: "Monthly",
                            grouping: [{ name: "ServiceName", type: "Dimension" }],
                        },
                        timePeriod: {
                            from: monthStart,
                            to: monthEnd
                        },
                        timeframe: "Custom",
                        };
                    const client = new CostManagementClient(this.#token);
                    const result = await client.query.usage(scope, parameters);
                    costs.push(result)
                }
                
                const groupedData = {};

                costs.forEach(item => {
                    for(const row of item.rows) {
                        const [computedAmount, timeUsageStarted, serviceName] = row.slice(0, 3);

                        if (!groupedData[serviceName]) {
                            groupedData[serviceName] = [];
                        }

                        groupedData[serviceName].push({ timeUsageStarted, computedAmount });
                    }
                    
                });

                // Sort the entries within each service based on timeUsageStarted
                for (const service in groupedData) {
                    const serviceData = groupedData[service];
                    const existingDates = new Set(serviceData.map(entry => entry.timeUsageStarted));

                    for (let i = 0; i < 12; i++) {
                        const monthDate = new Date(today);
                        monthDate.setMonth(today.getMonth() - i);
                        const monthYear = monthDate.getFullYear();
                    const monthMonth = String(monthDate.getMonth() + 1).padStart(2, '0');
                    const monthDateString = `${monthYear}-${monthMonth}-01T00:00:00`;

                    if (!existingDates.has(monthDateString)) {
                        serviceData.push({ timeUsageStarted: monthDateString, computedAmount: 0 });
                    }
                    }

                    // Sort the entries within each service based on timeUsageStarted
                    const sortedServiceData = serviceData.sort((a, b) => new Date(b.timeUsageStarted) - new Date(a.timeUsageStarted));
                    groupedData[service] = sortedServiceData;
                }

                // Add the improvement entry at the end of each service entry
                for (const service in groupedData) {
                    const serviceData = groupedData[service];
                    const firstTwoValues = serviceData.slice(0, 2).map(entry => entry.computedAmount);
                    const processedResult = this.#calcImprovement(...firstTwoValues);

                    // Add the processed result at the end of the service entry
                    serviceData.push({ improvement: processedResult });
                }

                resolve(groupedData)
                
            } catch (error) {
                reject(error)
            }
        })
    }

    listAccountCostsFromLast12Months() {
        return new Promise(async (resolve, reject) => {

            try {
                const subscriptions = await new Subscription(this.#token).listSubscriptions();
                var totalData = [];
                for (const subs of subscriptions) {
                    var today = new Date();
                    var year = today.getFullYear();
                    var month = today.getMonth() + 1;
                    var monthEnd = new Date(year, month, 1);
                    var monthStart = new Date(year, month - 11, 1);
    
                    const scope = `subscriptions/${subs.subscriptionId}`;
                    const parameters = {
                        type: "ActualCost",
                        dataset: {
                            aggregation: { totalCost: { name: "Cost", function: "Sum" } },
                            granularity: "Monthly",
                            grouping: [{ name: "ChargeType", type: "Dimension" }, {name: "PublisherType", type: "Dimension"}],
                        },
                        timePeriod: {
                            from: monthStart,
                            to: monthEnd
                        },
                        timeframe: "Custom",
                    };
                    const client = new CostManagementClient(this.#token);
                    const result = await client.query.usage(scope, parameters);
    
                    for (const row of result.rows) {
                        const [computedAmount, timeUsageStarted] = row.slice(0, 2);
                        totalData.push({ timeUsageStarted, computedAmountSum: computedAmount });
                    }
                }
    
                // Generate data for the last 12 months
                for (let i = 0; i < 12; i++) {
                    const monthDate = new Date(today);
                    monthDate.setMonth(today.getMonth() - i);
                    const monthYear = monthDate.getFullYear();
                    const monthMonth = String(monthDate.getMonth() + 1).padStart(2, '0');
                    const monthDateString = `${monthYear}-${monthMonth}-01T00:00:00`;
    
                    const existingEntry = totalData.find(entry => entry.timeUsageStarted === monthDateString);
    
                    if (!existingEntry) {
                        totalData.push({ timeUsageStarted: monthDateString, computedAmountSum: 0 });
                    }
                }
    
                // Sort the data by timeUsageStarted
                totalData.sort((a, b) => new Date(b.timeUsageStarted) - new Date(a.timeUsageStarted));
    
                var twoRecentCosts = totalData.slice(0, 2).map(item => item.computedAmountSum);
                var history = {}
                history['currentMonth'] = twoRecentCosts[0]
                history['lastMonth'] = twoRecentCosts[1]
                
                resolve({data: totalData, history: history})
    
            } catch (error) {
                reject(error);
            }
        })
    }

    getActualYearTotalUsage() {
        return new Promise(async (resolve, reject) => {

            try {
                const subscriptions = await new Subscription(this.#token).listSubscriptions();
                var totalData = [];
                var total = 0
                for (const subs of subscriptions) {
                    var today = new Date();
                    var year = today.getFullYear();
                    var month = today.getMonth() + 1;
                    var yearStart = new Date(year, 0, 1);
                    var nextMonth = new Date(year, month + 1, 1);
    
                    const scope = `subscriptions/${subs.subscriptionId}`;
                    const parameters = {
                        type: "ActualCost",
                        dataset: {
                            aggregation: { totalCost: { name: "Cost", function: "Sum" } },
                            granularity: "Monthly",
                            grouping: [{ name: "ChargeType", type: "Dimension" }, {name: "PublisherType", type: "Dimension"}],
                        },
                        timePeriod: {
                            from: yearStart,
                            to: nextMonth
                        },
                        timeframe: "Custom",
                    };
                    const client = new CostManagementClient(this.#token);
                    const result = await client.query.usage(scope, parameters);
    
                    for (const row of result.rows) {
                        const [computedAmount, timeUsageStarted] = row.slice(0, 2);
                        totalData.push({ timeUsageStarted, computedAmountSum: computedAmount });
                    }
                }
    
                totalData.forEach(res => {
                    total += res.computedAmountSum
                })
                
                resolve({[year]: total})
    
            } catch (error) {
                reject(error);
            }
        })
    }

    listAccountCostsByRegionsFromLast12Months() {
        return new Promise(async (resolve, reject) => {
            
            try {
                const subscriptions = await new Subscription(this.#token).listSubscriptions();
                var totalData = [];
                for (const subs of subscriptions) {
                    var today = new Date();
                    var year = today.getFullYear();
                    var month = today.getMonth() + 1;
                    var monthEnd = new Date(year, month, 1);
                    var monthStart = new Date(year, month - 11, 1);
    
                    const scope = `subscriptions/${subs.subscriptionId}`;
                    const parameters = {
                        type: "ActualCost",
                        dataset: {
                            aggregation: { totalCost: { name: "Cost", function: "Sum" } },
                            granularity: "Monthly",
                            grouping: [{type: "Dimension", name: "ResourceLocation"}]
                          },
                        timePeriod: {
                            from: monthStart,
                            to: monthEnd
                        },
                        timeframe: "Custom",
                    };
                    const client = new CostManagementClient(this.#token);
                    const result = await client.query.usage(scope, parameters);
                    totalData.push(result)
                }

                const byRegions = {};

                totalData.forEach(res => {
                    for (const row of res.rows) {
                        const [computedAmount, timeUsageStarted, region] = row.slice(0, 3);
    
                        if (!byRegions[region]) {
                            byRegions[region] = [];
                        }
    
                        byRegions[region].push({
                            timeUsageStarted,
                            computedAmount
                        });
                    }
                })
                // Generate data for the last 12 months
                for (let i = 0; i < 12; i++) {
                    const monthDate = new Date(today);
                    monthDate.setMonth(today.getMonth() - i);
                    const monthYear = monthDate.getFullYear();
                    const monthMonth = String(monthDate.getMonth() + 1).padStart(2, '0');
                    const monthDateString = `${monthYear}-${monthMonth}-01T00:00:00`;

                    for (const region in byRegions) {
                        const existingEntry = byRegions[region].find(entry => entry.timeUsageStarted === monthDateString);

                        if (!existingEntry) {
                            byRegions[region].push({ timeUsageStarted: monthDateString, computedAmount: 0 });
                        }
                    }
                }

                // Sort the data by timeUsageStarted within each region
                for (const region in byRegions) {
                    const regionData = byRegions[region];
                    regionData.sort((a, b) => new Date(b.timeUsageStarted) - new Date(a.timeUsageStarted));
                }
                
                resolve(byRegions)
    
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = Usage