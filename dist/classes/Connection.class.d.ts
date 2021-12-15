import { Neuron } from './Neuron.class';
export interface ConnectionSchema {
    inputNeuronName: string;
    weight?: number;
}
export interface Connection {
    inputNeuron: Neuron;
    weight: number;
}
