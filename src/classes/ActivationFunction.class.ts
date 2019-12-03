export interface ActivationFunctionSchema {
    (x: number): number;
    toString: () => string;
    derivative: (x: number) => number;
}
