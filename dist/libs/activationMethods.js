"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sigmoid = function (x) {
    return 1 / (1 + Math.exp(-x));
};
exports.sigmoid = sigmoid;
sigmoid.toString = () => 'sigmoid';
sigmoid.derivative = (x) => x * (1 - x);
const bipolarSigmoid = function (x) {
    return (1 - Math.exp(-x)) / (1 + Math.exp(-x));
};
exports.bipolarSigmoid = bipolarSigmoid;
bipolarSigmoid.toString = () => 'bipolarSigmoid';
bipolarSigmoid.derivative = (x) => 2 * Math.exp(x) / (Math.pow((Math.exp(x) + 1), 2));
const bypass = function (x) {
    return x;
};
exports.bypass = bypass;
bypass.toString = () => 'bypass';
bypass.derivative = () => 1;
//# sourceMappingURL=activationMethods.js.map