export interface ActivationFunctionSchema {
    (x: number): number;
    toString: () => ActivationFunctionNames;
    derivative: (x: number) => number;
}

export enum ActivationFunctionNames {
    SIGMOID = 'sigmoid',
    BIPOLAR_SIGMOID = 'bipolarSigmoid',
    BYPASS = 'bypass',
}