"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const _ = require("lodash");
const process = require("process");
function getMeanNetworkError(net, testData) {
    return testData.reduce((errorsSum, testCase) => errorsSum + net.getError(testCase), 0) / testData.length;
}
exports.getMeanNetworkError = getMeanNetworkError;
function showTrainingResults(network) {
    console.log(`After ${network.getEpochsTrained()} epochs:`);
    network.getTrainingCases().forEach(dataset => {
        network.run(dataset.inputs);
        console.log(`For ${dataset.inputs}:`);
        let outputStringFormatted;
        if (Math.abs(dataset.expected[0] - network.getOutputLayerValues()[0]) < 0.1) {
            outputStringFormatted = chalk.bold.greenBright(network.getOutputLayerValues());
        }
        else {
            outputStringFormatted = chalk.bold.redBright(network.getOutputLayerValues());
        }
        console.log(chalk.bgAnsi256(235)(`  Expected ${chalk.bold(dataset.expected)} : got ${outputStringFormatted}`));
    });
}
exports.showTrainingResults = showTrainingResults;
class Serie {
    constructor(plotterParent, label, color) {
        this.color = [255, 255, 255];
        this.points = [];
        this.offset = 0;
        this.width = 0;
        this.label = label ? label : '';
        this.color = color ? color : this.color;
        this.plotter = plotterParent;
    }
    setWidth(width) {
        this.width = width;
    }
    setOffset(offset) {
        this.offset = offset;
    }
    changeColor(newColor) {
        this.color = newColor;
    }
    addPoint(value) {
        this.points.push(value);
        this.maxValue = (value > this.maxValue || this.maxValue === undefined) && value.toString() !== 'NaN' ? value : this.maxValue;
        this.minValue = (value < this.minValue || this.minValue === undefined) && value.toString() !== 'NaN' ? value : this.minValue;
        this.plotter.pointAdded(this.length);
    }
    get length() {
        return this.points.length;
    }
}
function darkenColorRGB(color, timesDarker) {
    return color.map(colorChannel => Math.round(colorChannel / timesDarker));
}
exports.darkenColorRGB = darkenColorRGB;
class Plotter {
    constructor() {
        this.series = [];
        this.plotLength = 0;
        this.consoleColumns = process.stdout.columns;
        this.liveMode = true;
    }
    plotPoint(serie, lineIndex) {
        const darkerColor = darkenColorRGB(serie.color, 4);
        const value = serie.points[lineIndex];
        const previousValue = serie.points[lineIndex - 1];
        process.stdout.cursorTo(serie.offset);
        process.stdout.write('\u2502');
        if (value !== 0 && !value) {
            process.stdout.write('\u2219'.padStart(8, ' '));
            return;
        }
        const valueLabel = _.round(value, 3).toString().padEnd(7, ' ');
        let formattedLabel;
        if (value === serie.minValue) {
            formattedLabel = chalk.rgb(...serie.color)('\u25bc'.concat(valueLabel));
            process.stdout.moveCursor(-1, 0);
        }
        else if (value === serie.maxValue) {
            formattedLabel = chalk.rgb(...serie.color)('\u25b2'.concat(valueLabel));
            process.stdout.moveCursor(-1, 0);
        }
        else {
            formattedLabel = valueLabel;
        }
        process.stdout.write(formattedLabel.concat('\u2219'));
        const normValue = this.scaleToFit(value - serie.minValue, serie);
        const normPreviousValue = this.scaleToFit(previousValue - serie.minValue, serie);
        const difference = normPreviousValue - normValue;
        if (difference > 0) {
            process.stdout.write(chalk.rgb(...darkerColor)(`${'\u2219'.repeat(normValue)}`));
            process.stdout.moveCursor(-1, 0);
            process.stdout.write(chalk.rgb(...serie.color)(`\u250C${'\u2500'.repeat(difference)}`));
            process.stdout.moveCursor(-1, 0);
            process.stdout.write(chalk.rgb(...serie.color)('\u2518'));
        }
        else if (difference < 0) {
            process.stdout.write(chalk.rgb(...darkerColor)(`${'\u2219'.repeat(normPreviousValue)}`));
            process.stdout.moveCursor(-1, 0);
            process.stdout.write(chalk.rgb(...serie.color)(`\u2514${'\u2500'.repeat(-1 * difference)}`));
            process.stdout.moveCursor(-1, 0);
            process.stdout.write(chalk.rgb(...serie.color)('\u2510'));
        }
        else {
            process.stdout.write(chalk.rgb(...darkerColor)(`${'\u2219'.repeat(normValue)}`));
            process.stdout.moveCursor(-1, 0);
            process.stdout.write(chalk.rgb(...serie.color)(`\u2502`));
        }
    }
    plotLine(linePointsIndex) {
        _.orderBy(this.series, (serie) => serie.points[linePointsIndex], 'desc');
        this.series.forEach(serie => {
            this.plotPoint(serie, linePointsIndex);
        });
        process.stdout.write('\n');
    }
    scaleToFit(value, serie) {
        return Math.floor(value * ((serie.width - 10) / (serie.maxValue - serie.minValue)));
    }
    levelOutPlots(fillLastLine = false) {
        const mod = fillLastLine ? 0 : 1;
        this.series.forEach(serie => {
            while ((serie.length + mod) < this.plotLength) {
                serie.points.push(undefined);
            }
        });
    }
    drawLabelsAndStatsLine() {
        this.series.forEach(serie => {
            process.stdout.cursorTo(serie.offset);
            process.stdout.write(chalk.rgb(...serie.color)(`${serie.label} <${_.round(serie.minValue, 3)};${_.round(serie.maxValue, 3)}>`));
        });
        process.stdout.write('\n');
    }
    addSerie(color, label) {
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
    pointAdded(serieLength) {
        this.plotLength = this.plotLength >= serieLength ? this.plotLength : serieLength;
        if (this.liveMode && this.plotLength === serieLength) {
            this.levelOutPlots();
        }
    }
    draw() {
        this.drawLabelsAndStatsLine();
        for (let i = 0; i < this.plotLength; ++i) {
            this.plotLine(i);
        }
        this.drawLabelsAndStatsLine();
    }
    toggleLiveMode() {
        if (this.liveMode) {
            this.liveModeOff();
        }
        else {
            this.liveModeOn();
        }
    }
    liveModeOn() {
        this.liveMode = true;
        this.levelOutPlots(true);
    }
    liveModeOff() {
        this.liveMode = false;
        this.levelOutPlots(true);
    }
}
exports.Plotter = Plotter;
//# sourceMappingURL=lab.js.map