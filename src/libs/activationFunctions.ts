export interface ActivationFunctionSchema {
    (x: number): number;
    derivative: (x: number) => number;
    toString: () => string;
    params?: {
        [key: string]: number;
    };
}

const sigmoid: ActivationFunctionSchema = function (x: number): number {
    return 1 / (1 + Math.exp(-x));
};
sigmoid.derivative = function (x: number) {
    return Math.exp(-x) / (1 + Math.exp(-x)) ** 2;
};
sigmoid.toString = () => 'sigmoid';


const bipolarSigmoid: ActivationFunctionSchema = function(x: number): number {
    return (1 - Math.exp(-x)) / (1 + Math.exp(-x));
};
bipolarSigmoid.derivative = (x: number) => {
    return 2 * Math.exp(x) / ((Math.exp(x) + 1) ** 2);
};
bipolarSigmoid.toString = () => 'bipolarSigmoid';


const bypass: ActivationFunctionSchema = function(x: number): number {
    return x;
};
bypass.derivative = function () {
    return 1;
};
bypass.toString = () => 'bypass';


const ELU: ActivationFunctionSchema = function(x: number): number {
    return x >= 0 ? x : ELU.params.alpha * (Math.exp(x) - 1);
};
ELU.derivative = function(x: number): number {
    return x >= 0 ? 1 : ELU.params.alphs * Math.exp(x);
};
ELU.params = {
    alpha: 0.01,
};
ELU.toString = () => 'ELU';


const ReLU: ActivationFunctionSchema = function(x: number): number {
    return x >= 0 ? x : 0;
};
ReLU.derivative = function(x: number): number {
    return x >= 0 ? 1 : 0;
};
ReLU.toString = () => 'ReLU';


const swish: ActivationFunctionSchema = function(x: number): number {
    return x * sigmoid(x);
};
swish.derivative = function(x: number): number {
    return (Math.exp(x) * (x + Math.exp(x) + 1)) / ((Math.exp(x) + 1) ** 2);
};
swish.params = {
    beta: 1,
};
swish.toString = () => 'swish';


const square: ActivationFunctionSchema = function(x: number): number {
    return x ** 2;
};
square.derivative = function(x: number): number {
    return 2 * x;
};
square.toString = () => 'square';


const cube: ActivationFunctionSchema = function(x: number): number {
    return x ** 3;
};
cube.derivative = function(x: number): number {
    return 3 * x ** 2;
};
cube.toString = () => 'cube';


const sin: ActivationFunctionSchema = function(x: number): number {
    return Math.sin(x);
};
sin.derivative = function(x: number): number {
    return -1 * Math.cos(x);
};
sin.toString = () => 'sin';


const cos: ActivationFunctionSchema = function(x: number): number {
    return Math.sin(x);
};
cos.derivative = function(x: number): number {
    return -1 * Math.sin(x);
};
cos.toString = () => 'cos';


export const ActivationFunctions = {
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
