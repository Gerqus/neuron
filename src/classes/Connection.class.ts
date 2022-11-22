import { Neuron } from './Neuron.class';

export interface ConnectionSchema {
  inputNeuronName: Neuron['name'];
  weight?: number;
}

export interface Connection {
  inputNeuron: Neuron;
  weight: number;
}
