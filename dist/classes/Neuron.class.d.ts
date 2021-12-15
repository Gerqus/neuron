import { Connection, ConnectionSchema } from './Connection.class';
export interface NeuronSchema {
    activationFunctionName: string;
    bias?: number;
    initialState?: number;
    learningFactor?: number;
    name?: string;
    incomingConnectionsSchemas?: ConnectionSchema[];
}
export declare class Neuron {
    private connections;
    private activationFunction;
    private state;
    private costsSum;
    private delta;
    private inputsSum;
    private bias;
    private learningFactor;
    private derivativeCalcResult;
    private name;
    constructor({ bias, initialState, learningFactor, name, activationFunctionName, }: NeuronSchema);
    connect(inputNeuron: Neuron, weight?: number): void;
    increaseCostsSum(error: number): void;
    calculateDelta(): void;
    getDelta(): number;
    clearErrorRates(): void;
    private calculateActivationDerivative;
    updateConnectionsWeights(): void;
    updateBias(): void;
    getInputsWeightedSum(): number;
    activate(): void;
    getBias(): number;
    getCostsSum(): number;
    getName(): string;
    getConnections(): Connection[];
    getState(): number;
    setState(state: number): void;
    getActivationFunctionName(): string;
    getLearningFactor(): number;
    saveNauronToSchema(): NeuronSchema;
}
