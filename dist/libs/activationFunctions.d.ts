export interface ActivationFunctionSchema {
    (x: number): number;
    derivative: (x: number) => number;
    toString: () => string;
    params?: {
        [key: string]: number;
    };
}
interface ActivationFunctionsLib {
    [name: string]: ActivationFunctionSchema;
}
export declare enum ActivationFunctionsNames {
    sigmoid = "sigmoid",
    bipolarSigmoid = "bipolarSigmoid",
    bypass = "bypass",
    ELU = "ELU",
    ReLU = "ReLU",
    swish = "swish",
    square = "square",
    cube = "cube",
    sin = "sin",
    cos = "cos"
}
export declare const ActivationFunctions: ActivationFunctionsLib;
export {};
