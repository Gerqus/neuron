"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActivationFunction_class_1 = require("../classes/ActivationFunction.class");
const sigmoid = function (x) {
    return 1 / (1 + Math.exp(-x));
};
sigmoid.derivative = function (x) {
    return sigmoid(x) * (1 - sigmoid(x));
};
sigmoid.toString = () => ActivationFunction_class_1.ActivationFunctionNames.SIGMOID;
const bipolarSigmoid = function (x) {
    return (1 - Math.exp(-x)) / (1 + Math.exp(-x));
};
bipolarSigmoid.derivative = (x) => {
    return 2 * Math.exp(x) / (Math.pow((Math.exp(x) + 1), 2));
};
bipolarSigmoid.toString = () => ActivationFunction_class_1.ActivationFunctionNames.BIPOLAR_SIGMOID;
const bypass = function (x) {
    return x;
};
bypass.derivative = function () {
    return 1;
};
bypass.toString = () => ActivationFunction_class_1.ActivationFunctionNames.BYPASS;
const ELU = function (x) {
    return x >= 0 ? x : this.params.alpha * (Math.exp(x) - 1);
};
ELU.derivative = function (x) {
    return x >= 0 ? 1 : this.params.alphs * Math.exp(x);
};
ELU.params = {
    alpha: 0.1,
};
ELU.toString = () => ActivationFunction_class_1.ActivationFunctionNames.ELU;
const swish = function (x) {
    return x * sigmoid(x);
};
swish.derivative = function (x) {
    return sigmoid(x * this.params.beta) + x * this.params.beta * sigmoid(x * this.params.beta) * (1 - sigmoid(x * this.params.beta));
};
swish.params = {
    beta: 1,
};
swish.toString = () => ActivationFunction_class_1.ActivationFunctionNames.SWISH;
const square = function (x) {
    return Math.pow(x, 2);
};
square.derivative = function (x) {
    return 2 * x;
};
square.toString = () => ActivationFunction_class_1.ActivationFunctionNames.SQUARE;
const MSE = function (expected, predicted) {
    return (Math.pow((expected - predicted), 2)) / 2;
};
MSE.derivative = function (expected, predicted) {
    return expected - predicted;
};
MSE.toString = () => ActivationFunction_class_1.ActivationFunctionNames.MSE;
exports.ActivationFunctions = {
    sigmoid,
    bipolarSigmoid,
    bypass,
    ELU,
    swish,
    MSE,
};
//# sourceMappingURL=functions.js.map