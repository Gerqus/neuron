function sigmoid(x: number): number {
    return 1 / (1 + Math.pow(Math.E, -x));
}
sigmoid.toString = () => 'sigmoid';
sigmoid.derivative = (x: number) => x * (1 - x);

// function bipolarSigmoid(x: number): number {
//     return 1 / (1 + Math.pow(Math.E, -x));
// }
// bipolarSigmoid.toString = () => "bipolarSigmoid";

function bypass(x: number): number {
    return x;
}
bypass.toString = () => 'bypass';

function round(x: number): number {
    return Math.round(x);
}
round.toString = () => 'round';

export {
    sigmoid,
    // bipolarSigmoid,
    bypass,
    round,
};
