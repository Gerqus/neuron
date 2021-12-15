"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activationFunctions_1 = require("../libs/activationFunctions");
class Neuron {
    constructor({ bias = Math.random() * 0.5, initialState = 0, learningFactor = 0.1, name, activationFunctionName, }) {
        this.connections = [];
        this.costsSum = 0;
        this.delta = 0;
        this.inputsSum = 0;
        console.log(bias, initialState, learningFactor, name, activationFunctionName);
        this.activationFunction = activationFunctions_1.ActivationFunctions[activationFunctionName];
        this.bias = bias;
        this.state = initialState;
        this.learningFactor = learningFactor;
        this.name = name;
    }
    connect(inputNeuron, weight = 1) {
        this.connections.push({
            inputNeuron,
            weight,
        });
    }
    increaseCostsSum(error) {
        this.costsSum += error;
    }
    calculateDelta() {
        this.calculateActivationDerivative();
        this.delta = this.costsSum * this.derivativeCalcResult;
    }
    getDelta() {
        return this.delta;
    }
    clearErrorRates() {
        this.costsSum = 0;
    }
    calculateActivationDerivative() {
        this.derivativeCalcResult = this.activationFunction.derivative(this.getInputsWeightedSum() + this.bias);
    }
    updateConnectionsWeights() {
        this.connections.forEach(connection => {
            connection.weight += this.learningFactor * this.delta * connection.inputNeuron.state;
        });
    }
    updateBias() {
        this.bias += 0.1 * this.delta;
    }
    getInputsWeightedSum() {
        return this.connections.reduce((sum, connection) => sum += connection.inputNeuron.state * connection.weight, 0);
    }
    activate() {
        this.inputsSum = this.getInputsWeightedSum() + this.bias;
        this.state = this.activationFunction(this.inputsSum);
    }
    getBias() {
        return this.bias;
    }
    getCostsSum() {
        return this.costsSum;
    }
    getName() {
        return this.name;
    }
    getConnections() {
        return this.connections;
    }
    getState() {
        return this.state;
    }
    setState(state) {
        this.state = state;
    }
    getActivationFunctionName() {
        return this.activationFunction.name;
    }
    getLearningFactor() {
        return this.learningFactor;
    }
    saveNauronToSchema() {
        return {
            activationFunctionName: this.activationFunction.toString(),
            bias: this.bias,
            learningFactor: this.learningFactor,
            name: this.name,
            incomingConnectionsSchemas: this.connections.map(conn => ({
                inputNeuronName: conn.inputNeuron.getName(),
                weight: conn.weight,
            })),
        };
    }
}
exports.Neuron = Neuron;
//# sourceMappingURL=Neuron.class.js.map