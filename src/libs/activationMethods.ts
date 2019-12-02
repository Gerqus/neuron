function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
}
sigmoid.toString = () => 'sigmoid';
sigmoid.derivative = (x: number) => x * (1 - x);

function bipolarSigmoid(x: number): number {
    return (1 - Math.exp(-x)) / (1 + Math.exp(-x));
}
bipolarSigmoid.toString = () => 'bipolarSigmoid';
sigmoid.derivative = (x: number) => 2 * Math.exp(x) / ((Math.exp(x) + 1) ** 2);

function bypass(x: number): number {
    return x;
}
bypass.toString = () => 'bypass';
sigmoid.derivative = (x: number) => 1;

export {
    sigmoid,
    bipolarSigmoid,
    bypass,
};
