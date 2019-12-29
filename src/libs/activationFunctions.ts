import { ActivationFunctionSchema } from '../classes/ActivationFunction.class';

const sigmoid: ActivationFunctionSchema = function (x: number): number {
    return 1 / (1 + Math.exp(-x));
};
sigmoid.toString = () => 'sigmoid';
sigmoid.derivative = (x: number) => x * (1 - x);

const bipolarSigmoid: ActivationFunctionSchema = function(x: number): number {
    return (1 - Math.exp(-x)) / (1 + Math.exp(-x));
};
bipolarSigmoid.toString = () => 'bipolarSigmoid';
bipolarSigmoid.derivative = (x: number) => 2 * Math.exp(x) / ((Math.exp(x) + 1) ** 2);

const bypass: ActivationFunctionSchema = function(x: number): number {
    return x;
};
bypass.toString = () => 'bypass';
bypass.derivative = () => 1;

export const ActivationFunctions = {
    sigmoid,
    bipolarSigmoid,
    bypass,
};
