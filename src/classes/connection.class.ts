import { Neuron } from './neuron.class';

export interface Connection {
    inputNeuron: Neuron;
    weight: number;
}