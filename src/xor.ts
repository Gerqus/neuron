import { NetworkSchema } from './classes/Network.class';
import { ActivationFunctions } from './libs/activationFunctions';

const networkSchema: NetworkSchema = [
    [
        {
            activationFunction: ActivationFunctions.bypass,
            bias: 0,
            learningFactor: 10,
        },
        {
            activationFunction: ActivationFunctions.bypass,
            bias: 0,
            learningFactor: 10,
        },
    ],
    [
        {
            activationFunction: ActivationFunctions.sigmoid,
            learningFactor: 10,
        },
        {
            activationFunction: ActivationFunctions.sigmoid,
            learningFactor: 10,
        },
    ], [
        {
            activationFunction: ActivationFunctions.sigmoid,
            learningFactor: 10,
        },
    ],
];

const trainDataset: testData[] = [
    {
        inputs: [1, 0],
        expected: [1]
    },
    {
        inputs: [0, 1],
        expected: [1]
    },
    {
        inputs: [1, 1],
        expected: [0]
    },
    {
        inputs: [0, 0],
        expected: [0]
    },
];

export const XORNetworkSchema = networkSchema;
export const XORTrainDataset = trainDataset;
