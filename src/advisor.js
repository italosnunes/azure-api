let Util = require("./util");
const ResourceGraph = require('./resourcegraph')

class Advisor {

    #token = "";
    #util = "";

    constructor(token) {
        this.#token = token;
        this.#util = new Util();
        return this;
    }

    listRecommendations() {
        return new Promise(async (resolve, reject) => {

          try {
            const recommendations = await new ResourceGraph(this.#token).listResources("advisorresources | where type =~ 'microsoft.advisor/recommendations'")

            resolve(recommendations);
          } catch (err) {
            reject(err);
          }
        });
    }        
      
}

module.exports = Advisor