import { Connection, ConnectionDefinition } from './connection.class';

type activationFunction = (x: number) => number;

export class Neuron {
    private bias: number;
    public state: number;
    public activationFunction: activationFunction;
    public delta: number;

    constructor(activationFunctionToAssign: activationFunction, bias: number = 0.25) {
        this.incomingConnections = [];
        this.state = 0;
        this.activationFunction = activationFunctionToAssign;
        this.bias = bias;
    }

    setIncomingConnection({neuron, weight = 1, error = 0}: ConnectionDefinition): Connection {
        const newConnection = {
            neuron,
            weight,
            error,
        };
        this.incomingConnections.push(newConnection);
        return newConnection;
    }

    setOutgoingConnection(connection: Connection): void {
        this.outgoingConnections.push(connection);
    }

    getInputsWeightedSum(): number {
        return this.incomingConnections.reduce(
            (sum, connection): number => sum += connection.neuron.state * connection.weight,
            0
        ) + this.bias;
    }

    activate(): void {
        const inputsSum: number = this.getInputsWeightedSum();
        this.state = this.activationFunction(inputsSum);
    }

    activationDerivativeCalculation(): number { // only for sigmoid for now
        return this.state * (1 - this.state); // because derivative of sigmoid function is d(x)(1−d(x))
    }

    setNeuronError(error: number): void {
        this.delta = error;
    }

    getNeuronError(): number {
        return this.delta;
    }
}
