"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
exports.getRandomElement = getRandomElement;
function roundWithPrecision(value, precision = 2) {
    const mult = Math.pow(10, precision);
    return Math.round(value * mult) / mult;
}
exports.roundWithPrecision = roundWithPrecision;
//# sourceMappingURL=utils.js.map