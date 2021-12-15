import { LayerSchema } from './Layer.class';
import { testData } from '../interfaces/test-data.interface';
import { dataset } from '../interfaces/dataset.interface';
interface ConnectionLog {
    weight: number;
    state: number;
}
interface NeuronLog {
    index: number;
    state: number;
    bias: number;
    incomingConnections: ConnectionLog[];
    inputsWeightedSum: number;
    output: number;
    costsSum: number;
    activationDerivativeCalculation: number;
    delta: number;
}
interface LayerLog {
    layerIndex: number;
    neurons: NeuronLog[];
}
interface NetworkLog {
    output: number[];
    layers: LayerLog[];
    epochs: number;
    generalError: number;
    error: number;
}
export interface NetworkSchema {
    inputLayer: LayerSchema;
    hiddenLayers?: LayerSchema[];
    outputLayer: LayerSchema;
    epochsTrained?: number;
    trainingCases?: testData[];
}
export declare class Network {
    private layers;
    private chosenTrainingSet;
    private trainingCases;
    private epochsTrained;
    private indexedNeurons;
    constructor(schema: NetworkSchema);
    private checkSchema;
    private interlinkNeurons;
    setTrainingCases(trainingCases: testData[]): void;
    getTrainingCases(): testData[];
    run(inputData: dataset): void;
    train(epochs: number, successConditionFunction?: (net: Network) => boolean): number;
    logNetworkOutput(runLabel?: string): void;
    backpropagateError(): void;
    learn(): void;
    getOutputLayerValues(): number[];
    getError(testCase: testData): number;
    getNetworkStatus(trainingData: testData): NetworkLog;
    getEpochsTrained(): number;
    saveNetworkToSchema(): string;
    private addLayer;
    private drawTestDataToWork;
    setTestDataToWork(testSetIndex: number): void;
    private getInputLayer;
    private getHiddenLayers;
    private getOutputLayer;
    private getWorkingLayers;
    private getLayers;
    private setInputLayerValues;
}
export {};
