import { Neuron } from './neuron.class';

export interface Connection {
    inputNeuron: Neuron;
    recivingNeuron: Neuron
    weight: number;
    error: number
}