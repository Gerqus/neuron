import { ActivationFunctions } from './activationFunctions';
import { NeuronSchema } from '../classes/Neuron.class';

function InputNeuron(name?: string, incomingConnectionsNames?: string[]): NeuronSchema {
    return {
        activationFunction: ActivationFunctions.bypass,
        bias: 0,
        learningFactor: 0,
        name,
        incomingConnectionsNames,
    };
}

export const NeuronsLib = {
    InputNeuron,
};
