export interface ErrorFunctionSchema {
    (expected: number, predicted: number): number;
    derivative: (expected: number, predicted: number) => number;
    toString: () => string;
    params?: {
        [key: string]: number;
    };
}

const MSE: ErrorFunctionSchema = function(expected, predicted): number {
    return ((expected - predicted) ** 2) / 2;
};
MSE.derivative = function(expected, predicted): number {
    return expected - predicted;
};
MSE.toString = () => ErrorFunctionsNames.MSE;

export enum ErrorFunctionsNames {
    MSE = 'MSE',
}

export const ErrorFunctions = {
    MSE,
};
