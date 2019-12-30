import { ActivationFunctions } from './activationFunctions';
import { NeuronSchema } from '../classes/Neuron.class';

const InputNeuron: NeuronSchema = {
    activationFunction: ActivationFunctions.bypass,
    bias: 0,
    learningFactor: 0,
};

interface NeuronsLib {
    [name: string]: NeuronSchema;
}

export const NeuronsLib: NeuronsLib = {
    InputNeuron,
};
