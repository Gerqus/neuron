import { ActivationFunctionSchema, ActivationFunctionNames } from '../classes/ActivationFunction.class';

const sigmoid: ActivationFunctionSchema = function (x: number): number {
    return 1 / (1 + Math.exp(-x));
};
sigmoid.derivative = function (x: number) {
    return x * (1 - x);
};
sigmoid.toString = () => ActivationFunctionNames.SIGMOID;


const bipolarSigmoid: ActivationFunctionSchema = function(x: number): number {
    return (1 - Math.exp(-x)) / (1 + Math.exp(-x));
};
bipolarSigmoid.derivative = (x: number) => {
    return 2 * Math.exp(x) / ((Math.exp(x) + 1) ** 2);
};
bipolarSigmoid.toString = () => ActivationFunctionNames.BIPOLAR_SIGMOID;


const bypass: ActivationFunctionSchema = function(x: number): number {
    return x;
};
bypass.derivative = function () {
    return 1;
};
bypass.toString = () => ActivationFunctionNames.BYPASS;


const ELU: ActivationFunctionSchema = function(x: number): number {
    return x >= 0 ? x : this.params.alpha * (Math.exp(x) - 1);
};
ELU.derivative = function(x: number): number {
    return x >= 0 ? 1 : this.params.alphs * Math.exp(x);
};
ELU.params = {
    alpha: 0.1,
};
ELU.toString = () => ActivationFunctionNames.ELU;


const swish: ActivationFunctionSchema = function(x: number): number {
    return x * sigmoid(x);
};
swish.derivative = function(x: number): number {
    // return (Math.exp(-x) * (x + 1) + 1) / Math.pow(1 + Math.exp(-x), 2);
    return sigmoid(x * this.params.beta) + x * this.params.beta * sigmoid(x * this.params.beta) * (1 - sigmoid(x * this.params.beta));
};
swish.params = {
    beta: 1,
};
swish.toString = () => ActivationFunctionNames.SWISH;


const square: ActivationFunctionSchema = function(x: number): number {
    return x ** 2;
};
square.derivative = function(x: number): number {
    // return (Math.exp(-x) * (x + 1) + 1) / Math.pow(1 + Math.exp(-x), 2);
    return 2 * x;
};
square.toString = () => ActivationFunctionNames.SQUARE;


export const ActivationFunctions = {
    sigmoid,
    bipolarSigmoid,
    bypass,
    ELU,
    swish,
};
