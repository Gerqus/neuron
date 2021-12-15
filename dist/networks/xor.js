"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activationFunctions_1 = require("../libs/activationFunctions");
const neurons_1 = require("../libs/neurons");
const networkSchema = {
    inputLayer: {
        neurons: [
            neurons_1.NeuronsLib.InputNeuron('a'),
            neurons_1.NeuronsLib.InputNeuron('b'),
        ],
    },
    hiddenLayers: [
        {
            neurons: [
                {
                    activationFunctionName: activationFunctions_1.ActivationFunctionsNames.bipolarSigmoid,
                    name: 'h1',
                    incomingConnectionsSchemas: [
                        { inputNeuronName: 'a' },
                        { inputNeuronName: 'b' },
                    ],
                    learningFactor: 1,
                },
                {
                    activationFunctionName: activationFunctions_1.ActivationFunctionsNames.ReLU,
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
                activationFunctionName: activationFunctions_1.ActivationFunctionsNames.sigmoid,
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
const trainDataset = [
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
exports.XORNetworkSchema = networkSchema;
exports.XORTrainDataset = trainDataset;
//# sourceMappingURL=xor.js.map