import { Neuron } from './Neuron.class';

export interface Connection {
    inputNeuron: Neuron;
    weight: number;
}
