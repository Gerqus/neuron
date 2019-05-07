function sigmoid(x: number): number {
    return 1 / (1 + Math.pow(Math.E, -x));
}

function bipolarSigmoid(x: number): number {
    return 1 / (1 + Math.pow(Math.E, -x));
}

function bias(x: number): number {
    return x;
}

export {
    sigmoid,
    bipolarSigmoid,
    bias
};
