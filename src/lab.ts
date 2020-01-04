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

export class Plotter {
    private series: Serie[] = [];
    private plotLength = 0;
    private consoleColumns = process.stdout.columns;
    private maxPlotValue = 50;
    private minPlotValue = 0;

    private plotPoint(serie: Serie, pointIndex: number, color: Color, offset: number) {
        const value = serie.points[pointIndex];
        const previousValue = serie.points[pointIndex - 1];
        process.stdout.cursorTo(offset);
        process.stdout.write('\u2502');
        if (typeof value === 'undefined') {
            return;
        }
        process.stdout.write((Math.round(value * 100) / 100).toString().padEnd(5, ' '));
        const normValue = this.scaleToFit(value, serie);
        const normPreviousValue = this.scaleToFit(previousValue, serie);
        const difference = Math.abs(normPreviousValue - normValue);
        if (normPreviousValue > normValue) {
            process.stdout.moveCursor(normValue - 1, 0);
            process.stdout.write(chalk.rgb(...color)(`\u250C${'\u2500'.repeat(difference - 1)}\u2518`));
        } else if (normPreviousValue < normValue) {
            process.stdout.moveCursor(normPreviousValue - 1, 0);
            process.stdout.write(chalk.rgb(...color)(`\u2514${'\u2500'.repeat(difference - 1)}\u2510`));
        } else {
            process.stdout.moveCursor(normValue - 1, 0);
            process.stdout.write(chalk.rgb(...color)(`\u2502`));
        }
    }

    private plotLine(linePointsIndex: number): void {
        // this.series.forEach(serie => console.log(serie.id));
        _.orderBy(this.series, (serie) => serie.points[linePointsIndex], 'desc');
        this.series.forEach(serie => {
            this.plotPoint(serie, linePointsIndex, serie.color, serie.offset);
        });
        process.stdout.cursorTo(0);
        process.stdout.moveCursor(0, 1);
        process.stdout.cursorTo(0);
        // this.series.forEach(serie => console.log(serie.id));
    }

    private scaleToFit(value: number, serie: Serie) {
        return Math.floor(value * ((serie.width - 6) / (serie.maxValue - serie.minValue)));
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
