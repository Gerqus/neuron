import { Connection } from './Connection.class';
import { LEARNING_FACTOR } from '../libs/consts';
import { ActivationFunctionSchema } from './ActivationFunction.class';

export interface NeuronSchema {
    activationFunctions: ActivationFunctionSchema[];
    bias?: number;
}

export class Neuron {
    public connections: Connection[];
    activationFunctions: ActivationFunctionSchema[];
    state: number;
    /*private*/ connectionsErrorsSum: number;
    private delta: number;
    /*private*/ bias: number;

    constructor({activationFunctions, bias = Math.random() * 0.5}: NeuronSchema) {
        this.connections = [];
        this.state = 0;
        this.activationFunctions = activationFunctions;
        this.connectionsErrorsSum = 0;
        this.delta = 0;
        this.bias = bias;
        // this.bias = 0;
    }

    connect(inputNeuron: Neuron, weight: number = 1): void {
        this.connections.push({
            inputNeuron,
            weight
        });
    }

    public increaseConnectionsErrorsSum(error: number): void {
        this.connectionsErrorsSum += error;
    }

    public calculateDelta(): void {
        this.delta = this.connectionsErrorsSum * this.activationDerivativeCalculation();
    }

    public getDelta() {
        return this.delta;
    }

    public clearErrorRates(): void {
        this.connectionsErrorsSum = 0;
    }

    /*private*/ activationDerivativeCalculation(): number {
        // if (this.activationFunction !== sigmoid) { // only for sigmoid for now
        //     throw new Error(`Currently only sigmoids neuron can learn. Found "${this.activationFunction}" function. Terminating...`);
        // }

        return this.state * (1 - this.state); // because derivative of sigmoid function is d(x)(1−d(x))
    }

    public updateConnectionsWeights(): void {
        this.connections.forEach(connection => {
            connection.weight += LEARNING_FACTOR * Math.abs(this.connectionsErrorsSum) * this.delta * connection.inputNeuron.state;
        });
    }

    public updateBias(): void {
        this.bias += 0.1 * this.delta;
    }

    getInputsWeightedSum(): number {
        return this.connections.reduce(
            (sum, connection): number => sum += connection.inputNeuron.state * connection.weight,
            0
        ) + this.bias;
    }

    activate(): void {
        const inputsSum: number = this.getInputsWeightedSum();
        this.state = this.activationFunctions.reduce((output, fn) => fn(output), inputsSum);
    }
}
