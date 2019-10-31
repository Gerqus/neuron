import { Connection } from './connection.class';
import { sigmoid } from '../libs/activationMethods';

type activationFunction = (x: number) => number;

export class Neuron {
    public connections: Connection[];
    activationFunction: activationFunction;
    state: number;
    private connectionsErrorsSum: number;
    private delta: number;

    constructor(activationFunctionToAssign: activationFunction) {
        this.connections = [];
        this.state = 0;
        this.activationFunction = activationFunctionToAssign;
        this.connectionsErrorsSum = 0;
        this.delta = 0;
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

    public calculateDelta() {
        return this.connectionsErrorsSum * this.activationDerivativeCalculation();
    }

    public getDelta() {
        return this.delta;
    }

    private activationDerivativeCalculation(): number {
        if (this.activationFunction !== sigmoid) { // only for sigmoid for now
            throw new Error("Currently only sigmoids neuron can learn. Terminating...");
        }

        return this.state * (1 - this.state); // because derivative of sigmoid function is d(x)(1−d(x))
    }

    getInputsWeightedSum(): number {
        return this.connections.reduce(
            (sum, connection): number => sum += connection.inputNeuron.state * connection.weight,
            0
        )
    }

    activate(): void {
        const inputsSum: number = this.getInputsWeightedSum();
        this.state = this.activationFunction(inputsSum);
    }
}
