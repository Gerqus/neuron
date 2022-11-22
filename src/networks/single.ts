import { NetworkSchema } from '../classes/Network.class';
import { ActivationFunctionsNames } from '../libs/activationFunctions';
import { NeuronsLib } from '../libs/neurons';
import { TestData } from '../interfaces/test-data.interface';

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
                name: Symbol(),
            },
        ],
    },
};

const trainDataset: TestData[] = [
    {
        inputs: [0.5],
        expected: [0.25],
    },
];

export const SingleNetworkSchema = networkSchema;
export const SingleTrainDataset = trainDataset;
