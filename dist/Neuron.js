"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neuron = void 0;
class Neuron {
    constructor(weights) {
        this.defineFunction = 0;
        this.weights = weights;
    }
    setFunction(defineFunction) {
        this.defineFunction = defineFunction;
    }
    calculateY(x) {
        let v = 0;
        let i;
        for (i = 0; i < x.length; i++) {
            v = v + this.weights[i] * x[i];
        }
        v = v + this.weights[i]; // bias
        if (this.defineFunction === 1) {
            return this.hyperbolicTangent(v);
        }
        else {
            return this.logistic(v);
        }
    }
    logistic(v) {
        return 1 / (1 + Math.exp(-v));
    }
    hyperbolicTangent(v) {
        return Math.tanh(v);
    }
}
exports.Neuron = Neuron;
//# sourceMappingURL=Neuron.js.map