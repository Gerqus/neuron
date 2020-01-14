"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MSE = function (expected, predicted) {
    return (Math.pow((expected - predicted), 2)) / 2;
};
MSE.derivative = function (expected, predicted) {
    return expected - predicted;
};
MSE.toString = () => 'MSE';
exports.ErrorFunctions = {
    MSE,
};
//# sourceMappingURL=errorFunctions.js.map