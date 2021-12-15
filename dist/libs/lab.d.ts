import { Network } from '../classes/Network.class';
import { testData } from '../interfaces/test-data.interface';
export declare function getMeanNetworkError(net: Network, testData: testData[]): number;
export declare function showTrainingResults(network: Network): void;
declare type Color = [number, number, number];
declare class Serie {
    label: string;
    color: Color;
    points: number[];
    offset: number;
    width: number;
    maxValue: number;
    minValue: number;
    private plotter;
    constructor(plotterParent: Plotter, label?: string, color?: Color);
    setWidth(width: number): void;
    setOffset(offset: number): void;
    changeColor(newColor: Color): void;
    addPoint(value: number): void;
    get length(): number;
}
export declare function darkenColorRGB(color: Color, timesDarker: number): Color;
export declare class Plotter {
    private series;
    private plotLength;
    private consoleColumns;
    private liveMode;
    private plotPoint;
    private plotLine;
    private scaleToFit;
    private levelOutPlots;
    private drawLabelsAndStatsLine;
    addSerie(color?: Color, label?: string): Serie;
    pointAdded(serieLength: number): void;
    draw(): void;
    toggleLiveMode(): void;
    liveModeOn(): void;
    liveModeOff(): void;
}
export {};
