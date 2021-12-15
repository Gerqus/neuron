"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sigmoid = function (x) {
    return 1 / (1 + Math.exp(-x));
};
sigmoid.derivative = function (x) {
    return Math.exp(-x) / Math.pow((1 + Math.exp(-x)), 2);
};
sigmoid.toString = () => ActivationFunctionsNames.sigmoid;
const bipolarSigmoid = function (x) {
    return (1 - Math.exp(-x)) / (1 + Math.exp(-x));
};
bipolarSigmoid.derivative = (x) => {
    return 2 * Math.exp(x) / Math.pow((Math.exp(x) + 1), 2);
};
bipolarSigmoid.toString = () => ActivationFunctionsNames.bipolarSigmoid;
const bypass = function (x) {
    return x;
};
bypass.derivative = function () {
    return 1;
};
bypass.toString = () => ActivationFunctionsNames.bypass;
const ELU = function (x) {
    return x >= 0 ? x : ELU.params.alpha * (Math.exp(x) - 1);
};
ELU.derivative = function (x) {
    return x >= 0 ? 1 : ELU.params.alphs * Math.exp(x);
};
ELU.params = {
    alpha: 0.01,
};
ELU.toString = () => ActivationFunctionsNames.ELU;
const ReLU = function (x) {
    return x >= 0 ? x : 0;
};
ReLU.derivative = function (x) {
    return x >= 0 ? 1 : 0;
};
ReLU.toString = () => ActivationFunctionsNames.ReLU;
const swish = function (x) {
    return x * sigmoid(x);
};
swish.derivative = function (x) {
    return (Math.exp(x) * (x + Math.exp(x) + 1)) / (Math.pow((Math.exp(x) + 1), 2));
};
swish.params = {
    beta: 1,
};
swish.toString = () => ActivationFunctionsNames.swish;
const square = function (x) {
    return Math.pow(x, 2);
};
square.derivative = function (x) {
    return 2 * x;
};
square.toString = () => ActivationFunctionsNames.square;
const cube = function (x) {
    return Math.pow(x, 3);
};
cube.derivative = function (x) {
    return 3 * Math.pow(x, 2);
};
cube.toString = () => ActivationFunctionsNames.cube;
const sin = function (x) {
    return Math.sin(x);
};
sin.derivative = function (x) {
    return -1 * Math.cos(x);
};
sin.toString = () => ActivationFunctionsNames.sin;
const cos = function (x) {
    return Math.sin(x);
};
cos.derivative = function (x) {
    return -1 * Math.sin(x);
};
cos.toString = () => ActivationFunctionsNames.cos;
var ActivationFunctionsNames;
(function (ActivationFunctionsNames) {
    ActivationFunctionsNames["sigmoid"] = "sigmoid";
    ActivationFunctionsNames["bipolarSigmoid"] = "bipolarSigmoid";
    ActivationFunctionsNames["bypass"] = "bypass";
    ActivationFunctionsNames["ELU"] = "ELU";
    ActivationFunctionsNames["ReLU"] = "ReLU";
    ActivationFunctionsNames["swish"] = "swish";
    ActivationFunctionsNames["square"] = "square";
    ActivationFunctionsNames["cube"] = "cube";
    ActivationFunctionsNames["sin"] = "sin";
    ActivationFunctionsNames["cos"] = "cos";
})(ActivationFunctionsNames = exports.ActivationFunctionsNames || (exports.ActivationFunctionsNames = {}));
exports.ActivationFunctions = {
    sigmoid,
    bipolarSigmoid,
    bypass,
    ELU,
    ReLU,
    swish,
    square,
    cube,
    sin,
    cos,
};
//# sourceMappingURL=activationFunctions.js.map