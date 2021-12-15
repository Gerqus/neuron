export interface ErrorFunctionSchema {
    (expected: number, predicted: number): number;
    derivative: (expected: number, predicted: number) => number;
    toString: () => string;
    params?: {
        [key: string]: number;
    };
}
export declare enum ErrorFunctionsNames {
    MSE = "MSE"
}
export declare const ErrorFunctions: {
    MSE: ErrorFunctionSchema;
};
