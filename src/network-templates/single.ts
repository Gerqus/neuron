import { NetworkSchema } from '../classes/Network.class';
import { ActivationFunctionsNames } from '../libs/activationFunctions';
import { NeuronsLib } from '../libs/neurons';
import { TestData } from '../interfaces/test-data.interface';

export const trainingData: TestData[] = [
  {
      inputs: [0.5],
      expected: [0.25],
  },
];

export const networkSchema: NetworkSchema = {
    inputLayer: {
        neurons: [
            NeuronsLib.InputNeuron('a'),
        ],
    },
    outputLayer: {
            neurons: [
            {
                activationFunctionName: ActivationFunctionsNames.sigmoid,
                name: Symbol(),
            },
        ],
    },
    trainingCases: trainingData,
};
