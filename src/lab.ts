import { Network } from './classes/Network.class';
import * as chalk from 'chalk';
import * as _ from 'lodash';
import process = require('process');

export function getMeanNetworkError(net: Network, testData: testData[]) {
    return testData.reduce(
        (errorsSum, testCase) =>
            errorsSum + net.getError(testCase),
        0
    ) / testData.length;
}

export function showTrainingResults(network: Network): void {
    network.getTrainingCases().forEach(dataset => {
        network.run(dataset.inputs);
        console.log(`After ${network.getEpochsTrained()} epochs for ${dataset.inputs}:`);
        let outputStringFormatted: string;
        if (Math.abs(dataset.expected[0] - network.getOutputLayerValues()[0]) < 0.1) {
            outputStringFormatted = chalk.bold.greenBright(network.getOutputLayerValues());
        } else {
            outputStringFormatted = chalk.bold.redBright(network.getOutputLayerValues());
        }
        console.log(chalk.bgAnsi256(235)(`Expected ${chalk.bold(dataset.expected)} : got ${outputStringFormatted}`));
    });
}

type Color = [number, number, number];

class Serie {
    public id: symbol;
    public color: Color = [255, 255, 255];
    public points: number[] = [];
    public offset = 0;
    public width = 0;
    public maxValue = 0;
    public minValue = 0;
    private plotter: Plotter;

    constructor(plotterParent: Plotter, label?: string, color?: Color) {
        this.id = Symbol(label ? label : '');
        this.color = color ? color : this.color;
        this.plotter = plotterParent;
    }

    public setWidth(width: number) {
        this.width = width;
    }

    public setOffset(offset: number) {
        this.offset = offset;
    }

    public changeColor(newColor: Color): void {
        this.color = newColor;
    }

    public addPoint(value: number): void {
        this.points.push(value);
        this.maxValue = value > this.maxValue ? value : this.maxValue;
        this.minValue = value < this.minValue ? value : this.minValue;
        this.plotter.pointAdded(this.length);
    }

    get length(): number {
        return this.points.length;
    }
}

export function darkenColorRGB(color: Color, timesDarker: number): Color {
    return color.map(colorChannel => Math.round(colorChannel / timesDarker)) as Color;
}

export class Plotter {
    private series: Serie[] = [];
    private plotLength = 0;
    private consoleColumns = process.stdout.columns;

    private plotPoint(serie: Serie, pointIndex: number, color: Color, offset: number) {
        const darkerColor = darkenColorRGB(color, 4);
        const value = serie.points[pointIndex];
        const previousValue = serie.points[pointIndex - 1];
        process.stdout.cursorTo(offset);
        process.stdout.write('\u2502');
        if (value !== 0 && !value) {
            process.stdout.write('\u2219'.padStart(8, ' '));
            return;
        }
        process.stdout.write((Math.round(value * 100) / 100).toString().padEnd(7, ' ').concat('\u2219'));
        const normValue = this.scaleToFit(value - serie.minValue, serie);
        const normPreviousValue = this.scaleToFit(previousValue - serie.minValue, serie);
        const difference = normPreviousValue - normValue;
        if (difference > 0) {
            process.stdout.write(chalk.rgb(...darkerColor)(`${'\u2219'.repeat(normValue)}`));
            process.stdout.moveCursor(-1, 0);
            process.stdout.write(chalk.rgb(...color)(`\u250C${'\u2500'.repeat(difference)}`));
            process.stdout.moveCursor(-1, 0);
            process.stdout.write(chalk.rgb(...color)('\u2518'));
        } else if (difference < 0) {
            process.stdout.write(chalk.rgb(...darkerColor)(`${'\u2219'.repeat(normPreviousValue)}`));
            process.stdout.moveCursor(-1, 0);
            process.stdout.write(chalk.rgb(...color)(`\u2514${'\u2500'.repeat(-1 * difference)}`));
            process.stdout.moveCursor(-1, 0);
            process.stdout.write(chalk.rgb(...color)('\u2510'));
        } else {
            process.stdout.write(chalk.rgb(...darkerColor)(`${'\u2219'.repeat(normValue)}`));
            process.stdout.moveCursor(-1, 0);
            process.stdout.write(chalk.rgb(...color)(`\u2502`));
        }
    }

    private plotLine(linePointsIndex: number): void {
        _.orderBy(this.series, (serie) => serie.points[linePointsIndex], 'desc');
        this.series.forEach(serie => {
            this.plotPoint(serie, linePointsIndex, serie.color, serie.offset);
        });
        process.stdout.write('\n');
    }

    private scaleToFit(value: number, serie: Serie) {
        return Math.floor(value * ((serie.width - 10) / (serie.maxValue - serie.minValue)));
    }

    public addSerie(label?: string, color?: Color): Serie {
        const newSerie = new Serie(this, label, color);
        this.series.push(newSerie);
        const seriesWidth = Math.floor(this.consoleColumns / this.series.length);
        this.series.forEach((serie, index) => {
            serie.setOffset(seriesWidth * index);
            serie.setWidth(seriesWidth);
        });

        while (newSerie.length < this.plotLength) {
            newSerie.addPoint(undefined);
        }

        return newSerie;
    }

    public pointAdded(serieLength: number) {
        this.series.forEach(serie => {
            while (serie.length + 1 < serieLength) {
                serie.addPoint(undefined);
            }
        });
        this.plotLength = this.plotLength >= serieLength ? this.plotLength : serieLength;
    }

    public draw() {
        console.clear();
        for (let i = 0; i < this.plotLength; ++i) {
            this.plotLine(i);
        }
    }
}
