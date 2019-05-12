import { Connection } from './connection.class';

type activationFunction = (x: number) => number;

export class Neuron {
    private connections: Connection[];
    private activationFunction: activationFunction;
    state: number;

    constructor(activationFunctionToAssign: activationFunction) {
        this.connections = [];
        this.state = 0;
        this.activationFunction = activationFunctionToAssign;
    }

    connect(inputNeuron: Neuron, weight: number = 1): void {
        this.connections.push({
            inputNeuron,
            weight
        });
    }

    activate(): void {
        const inputsSum: number = this.connections.reduce(
            (sum, connection): number => sum += connection.inputNeuron.state * connection.weight,
            0
        );
        this.state = this.activationFunction(inputsSum);
    }
}
