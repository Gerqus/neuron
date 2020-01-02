export interface ActivationFunctionSchema {
    (x: number): number;
    toString: () => ActivationFunctionNames;
    derivative: (x: number) => number;
    params?: {
        [key: string]: number;
    };
}

export enum ActivationFunctionNames {
    SIGMOID = 'sigmoid',
    BIPOLAR_SIGMOID = 'bipolarSigmoid',
    BYPASS = 'bypass',
    ELU = 'ELU',
    SWISH = 'swish',
    SQUARE = 'square',
}
