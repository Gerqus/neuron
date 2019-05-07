import { Connection } from "./connection.class";

type activationFunction = (x: number) => number;

export class Neuron {
    connections: Connection[];
    state: number;
    activationFunction: activationFunction;

    constructor(activationFunction: activationFunction) {
        this.activationFunction = activationFunction;
    }
    
    activate(): void {
        const inputsSum: number = this.connections.reduce(
            (sum, connection): number => sum += connection.inputNeuron.state * (connection.weight || 1),
            0
        );
        this.state = this.activationFunction(inputsSum);
    }
}
