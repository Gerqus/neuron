import { NetworkSchema } from '../classes/Network.class';
import { ActivationFunctions } from '../libs/activationFunctions';
import { NeuronsLib } from '../libs/neurons';

const networkSchema: NetworkSchema = {
    inputLayer: [
        NeuronsLib.InputNeuron('a'),
    ],
    outputLayer: [
        {
            activationFunction: ActivationFunctions.sigmoid,
        },
    ],
};

const trainDataset: testData[] = [
    {
        inputs: [0.5],
        expected: [0.25],
    },
];

export const SingleNetworkSchema = networkSchema;
export const SingleTrainDataset = trainDataset;
