"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
const Neuron_1 = require("./Neuron");
class Network {
    constructor(hiddenNeuronsSize, resultNeuronsSize) {
        this.hiddenNeuronsSize = hiddenNeuronsSize;
        this.resultNeuronsSize = resultNeuronsSize;
        this.hiddenNeuronLayer = [];
        this.resultNeuronLayer = [];
        this.results = [];
    }
    setNetworkWeights(entrySize, weights) {
        let k = 0;
        for (let i = 0; i < this.hiddenNeuronsSize; i++) {
            let temp = [];
            for (let j = 0; j < entrySize; j++) {
                temp.push(weights[k]);
                k++;
            }
            this.hiddenNeuronLayer.push(new Neuron_1.Neuron(temp));
        }
        for (let i = 0; i < this.resultNeuronsSize; i++) {
            let temp = [];
            for (let j = 0; j < entrySize; j++) {
                temp.push(weights[k]);
                k++;
            }
            this.resultNeuronLayer.push(new Neuron_1.Neuron(temp));
        }
    }
    propagation(x) {
        let hiddenLayerResults = [];
        for (let i = 0; i < this.hiddenNeuronsSize; i++) {
            const synapse = this.hiddenNeuronLayer[i].calculateY(x);
            console.log(synapse);
            hiddenLayerResults.push(synapse);
        }

        for (let i = 0; i < this.resultNeuronsSize; i++) {
            const synapse = this.resultNeuronLayer[i].calculateY(x);
            this.results.push(synapse);
        }
        return this.results;
    }
}
exports.Network = Network;
//# sourceMappingURL=Network.js.map