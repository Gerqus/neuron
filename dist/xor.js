"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activationFunctions_1 = require("./libs/activationFunctions");
const neurons_1 = require("./libs/neurons");
const networkSchema = {
    inputLayer: [
        neurons_1.NeuronsLib.InputNeuron,
        neurons_1.NeuronsLib.InputNeuron,
    ],
    hiddenLayers: [
        [
            {
                activationFunction: activationFunctions_1.ActivationFunctions.ReLU,
            },
            {
                activationFunction: activationFunctions_1.ActivationFunctions.ReLU,
            },
        ],
    ],
    outputLayer: [
        {
            activationFunction: activationFunctions_1.ActivationFunctions.sigmoid,
        },
    ],
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