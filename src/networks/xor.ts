import { NetworkSchema } from '../classes/Network.class';
import { ActivationFunctionsNames } from '../libs/activationFunctions';
import { NeuronsLib } from '../libs/neurons';
import { TestData } from '../interfaces/test-data.interface';

const networkSchema: NetworkSchema = {
    inputLayer: {
        neurons: [
            NeuronsLib.InputNeuron('a'),
            NeuronsLib.InputNeuron('b'),
        ],
    },
    hiddenLayers: [
        {
            neurons: [
                {
                    activationFunctionName: ActivationFunctionsNames.bipolarSigmoid,
                    name: 'h1',
                    incomingConnectionsSchemas: [
                        { inputNeuronName: 'a' },
                        { inputNeuronName: 'b' },
                    ],
                    learningFactor: 1,
                },
                {
                    activationFunctionName: ActivationFunctionsNames.ReLU,
                    name: 'h2',
                    incomingConnectionsSchemas: [
                        { inputNeuronName: 'a' },
                        { inputNeuronName: 'b' },
                    ],
                    learningFactor: 1,
                },
            ],
        },
    ],
    outputLayer: {
        neurons: [
            {
                activationFunctionName: ActivationFunctionsNames.sigmoid,
                name: 'output',
                incomingConnectionsSchemas: [
                    { inputNeuronName: 'h1' },
                    { inputNeuronName: 'h2' },
                ],
                learningFactor: 1,
            },
        ],
    },
};

const trainDataset: TestData[] = [
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
