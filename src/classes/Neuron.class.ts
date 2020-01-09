import { Connection } from './Connection.class';
import { ActivationFunctionSchema } from '../libs/activationFunctions';

interface NeuronCoordinates {
    layerIndex: number;
    neuronIndex: number;
}

export interface NeuronSchema {
    activationFunction: ActivationFunctionSchema;
    bias?: number;
    initialState?: number;
    learningFactor?: number;
    name?: string;
}

export class Neuron {
    private connections: Connection[] = [];
    private activationFunction: ActivationFunctionSchema;
    private state: number;
    private costsSum = 0;
    private delta = 0;
    private inputsSum = 0;
    private bias: number;
    private learningFactor: number;
    private derivativeCalcResult: number;
    private name: string;
    private coordinates: NeuronCoordinates;

    constructor(
        {
            activationFunction,
            bias = Math.random() * 0.5,
            initialState = 0,
            learningFactor = 0.1,
            name,
        }: NeuronSchema,
        coordinates: NeuronCoordinates
    ) {
        console.log(JSON.stringify(coordinates));
        this.activationFunction = activationFunction;
        this.bias = bias;
        this.state = initialState;
        this.learningFactor = learningFactor;
        this.name = name;
        this.coordinates = coordinates;
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

    public getName(): string {
        return this.name;
    }

    public getConnections(): Connection[] {
        return this.connections;
    }

    public getState(): number {
        return this.state;
    }

    public setState(state: number): void {
        this.state = state;
    }

    public getActivationFunctionName(): string {
        return this.activationFunction.name;
    }
}
