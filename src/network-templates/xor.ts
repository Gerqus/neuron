import { NetworkSchema } from '../classes/Network.class';
import { ActivationFunctionsNames } from '../libs/activationFunctions';
import { TestData } from '../interfaces/test-data.interface';

export const trainingData: TestData[] = [
  {
      inputs: [1, 0],
      expected: [1],
  },
  {
      inputs: [0, 1],
      expected: [1],
  },
  {
      inputs: [1, 1],
      expected: [0],
  },
  {
      inputs: [0, 0],
      expected: [0],
  },
];

export const networkSchema: NetworkSchema = {
  inputLayer: {
    neurons: [
      { activationFunctionName: ActivationFunctionsNames.bypass, bias: 0, name: 'INP #0' },
      { activationFunctionName: ActivationFunctionsNames.bypass, bias: 0, name: 'INP #1' },
    ],
  },
  hiddenLayers: [
    {
      neurons: [
        { activationFunctionName: ActivationFunctionsNames.sigmoid, bias: 1, learningFactor: 0.75, name: 'HID0 #0' },
        { activationFunctionName: ActivationFunctionsNames.sigmoid, bias: -1, learningFactor: 0.75, name: 'HID0 #1' },
      ],
    },
  ],
  outputLayer: {
    neurons: [
      { activationFunctionName: ActivationFunctionsNames.sigmoid, bias: 0, learningFactor: 0.75, name: 'OUT #0' },
    ],
  },
  trainingCases: trainingData,
};