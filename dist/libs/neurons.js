"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activationFunctions_1 = require("./activationFunctions");
function InputNeuron(name, incomingConnectionsSchemas) {
    return {
        activationFunctionName: activationFunctions_1.ActivationFunctionsNames.bypass,
        bias: 0,
        learningFactor: 0,
        name,
        incomingConnectionsSchemas,
    };
}
exports.NeuronsLib = {
    InputNeuron,
};
//# sourceMappingURL=neurons.js.map