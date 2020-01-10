import { NetworkSchema } from '../classes/Network.class';
import { ActivationFunctions } from '../libs/activationFunctions';
import { NeuronsLib } from '../libs/neurons';

const networkSchema: NetworkSchema = {
    inputLayer: [
        NeuronsLib.InputNeuron('a'),
        NeuronsLib.InputNeuron('b'),
    ],
    hiddenLayers: [
        [
            {
                activationFunction: ActivationFunctions.sigmoid,
                name: 'h1',
                incomingConnectionsNames: ['a', 'b'],
                learningFactor: 1,
            },
            {
                activationFunction: ActivationFunctions.sigmoid,
                name: 'h2',
                incomingConnectionsNames: ['a', 'b'],
                learningFactor: 1,
            },
        ],
    ],
    outputLayer: [
        {
            activationFunction: ActivationFunctions.sigmoid,
            name: 'output',
            incomingConnectionsNames: ['h1', 'h2'],
            learningFactor: 1,
        },
    ],
};

const trainDataset: testData[] = [
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

export const XORNetworkSchema = networkSchema;
export const XORTrainDataset = trainDataset;
