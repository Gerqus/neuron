function sigmoid(x: number): number {
    return 1 / (1 + Math.pow(Math.E, -x));
}
sigmoid.toString = () => "sigmoid";

// function bipolarSigmoid(x: number): number {
//     return 1 / (1 + Math.pow(Math.E, -x));
// }
// bipolarSigmoid.toString = () => "bipolarSigmoid";

function bias(x: number): number {
    return x;
}
bias.toString = () => "bias";

export {
    sigmoid,
    // bipolarSigmoid,
    bias
};
