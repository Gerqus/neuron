function sigmoid(x: number): number {
    return 1 / (1 + Math.pow(Math.E, -x));
}

function bipolarSigmoid(x: number): number {
    return 1 / (1 + Math.pow(Math.E, -x));
}

export {
    sigmoid,
    bipolarSigmoid
};
