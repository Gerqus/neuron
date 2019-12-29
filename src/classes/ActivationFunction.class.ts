export interface ActivationFunctionSchema {
    (x: number): number;
    toString: () => string;
    derivative: (x: number) => number;
}

// export const ActivationFunctionNames = ['sigmoid', 'bipolarSigmoid', 'bypass'];
// export type ActivationFunctionName = typeof ActivationFunctionNames[number];

export enum ActivationFunctionNames {
    SIGMOID = 'sigmoid',
    BIPOLAR_SIGMOID = 'bipolarSigmoid',
    BYPASS = 'bypass',
}