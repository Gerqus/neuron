import { NetworkSchema } from '../classes/Network.class';
import { ActivationFunctionsNames } from '../libs/activationFunctions';
import { NeuronsLib } from '../libs/neurons';

const networkSchema: NetworkSchema = {
    inputLayer: {
        neurons: [
            NeuronsLib.InputNeuron('a'),
        ],
    },
    outputLayer: {
            neurons: [
            {
                activationFunctionName: ActivationFunctionsNames.sigmoid,
            },
        ],
    },
};

const trainDataset: testData[] = [
    {
        inputs: [0.5],
        expected: [0.25],
    },
];

export const SingleNetworkSchema = networkSchema;
export const SingleTrainDataset = trainDataset;
