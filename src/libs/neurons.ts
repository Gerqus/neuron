import { ActivationFunctionsNames } from './activationFunctions';
import { NeuronSchema } from '../classes/Neuron.class';
import { ConnectionSchema } from '../classes/Connection.class';

function InputNeuron(name: string, incomingConnectionsSchemas?: ConnectionSchema[]): NeuronSchema {
  return {
    activationFunctionName: ActivationFunctionsNames.bypass,
    bias: 0,
    learningFactor: 0,
    name,
    incomingConnectionsSchemas,
  };
}

export const NeuronsLib = {
  InputNeuron,
};
