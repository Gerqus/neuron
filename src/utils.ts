export function getRandomElement<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function roundWithPrecision(value: number, precision: number = 2): number {
    const mult = Math.pow(10, precision);
    return Math.round(value * mult) / mult;
}