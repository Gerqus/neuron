import { NeuronSchema } from '../classes/Neuron.class';
import { ConnectionSchema } from '../classes/Connection.class';
declare function InputNeuron(name?: string, incomingConnectionsSchemas?: ConnectionSchema[]): NeuronSchema;
export declare const NeuronsLib: {
    InputNeuron: typeof InputNeuron;
};
export {};
