"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activationFunctions_1 = require("../libs/activationFunctions");
const neurons_1 = require("../libs/neurons");
const networkSchema = {
    inputLayer: {
        neurons: [
            neurons_1.NeuronsLib.InputNeuron('a'),
        ],
    },
    outputLayer: {
        neurons: [
            {
                activationFunctionName: activationFunctions_1.ActivationFunctionsNames.sigmoid,
            },
        ],
    },
};
const trainDataset = [
    {
        inputs: [0.5],
        expected: [0.25],
    },
];
exports.SingleNetworkSchema = networkSchema;
exports.SingleTrainDataset = trainDataset;
//# sourceMappingURL=single.js.map