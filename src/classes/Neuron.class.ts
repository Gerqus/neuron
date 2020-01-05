import { Connection } from './Connection.class';
import { ActivationFunctionSchema } from '../libs/activationFunctions';

export interface NeuronSchema {
    activationFunction: ActivationFunctionSchema;
    bias?: number;
    initialState?: number;
    learningFactor?: number;
}

export class Neuron {
    public connections: Connection[];
    activationFunction: ActivationFunctionSchema;
    state: number;
    private costsSum: number;
    private delta: number;
    private bias: number;
    private learningFactor: number;
    private inputsSum: number;
    private derivativeCalcResult: number;

    constructor({activationFunction, bias = Math.random() * 0.5, initialState = 0, learningFactor = 0.1}: NeuronSchema) {
        this.activationFunction = activationFunction;
        this.bias = bias;
        this.state = initialState;
        this.learningFactor = learningFactor;

        this.connections = [];
        this.costsSum = 0;
        this.delta = 0;
        this.inputsSum = 0;
    }

    connect(inputNeuron: Neuron, weight: number = 1): void {
        this.connections.push({
            inputNeuron,
            weight,
        });
    }

    public increaseCostsSum(error: number): void {
        this.costsSum += error;
    }

    public calculateDelta(): void {
        this.calculateActivationDerivative();
        this.delta = this.costsSum * this.derivativeCalcResult;
    }

    public getDelta() {
        return this.delta;
    }

    public clearErrorRates(): void {
        this.costsSum = 0;
    }

    private calculateActivationDerivative(): void {
        this.derivativeCalcResult = this.activationFunction.derivative(this.getInputsWeightedSum() + this.bias);
    }

    public updateConnectionsWeights(): void {
        this.connections.forEach(connection => {
            connection.weight += this.learningFactor * this.delta * connection.inputNeuron.state;
        });
    }

    public updateBias(): void {
        this.bias += 0.1 * this.delta;
    }

    public getInputsWeightedSum(): number {
        return this.connections.reduce(
            (sum, connection): number => sum += connection.inputNeuron.state * connection.weight,
            0
        );
    }

    public activate(): void {
        this.inputsSum = this.getInputsWeightedSum() + this.bias;
        this.state = this.activationFunction(this.inputsSum);
    }

    public getBias(): number {
        return this.bias;
    }

    public getCostsSum(): number {
        return this.costsSum;
    }
}
