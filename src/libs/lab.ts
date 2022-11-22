import { Network } from '../classes/Network.class';
import * as chalk from 'chalk';
import * as _ from 'lodash';
import process = require('process');
import { TestData } from '../interfaces/test-data.interface';

export function getMeanNetworkError(net: Network, testData: TestData[]) {
  return testData.reduce(
    (errorsSum, testCase) =>
    errorsSum + net.getError(testCase),
    0
    ) / testData.length;
  }
  
  export function showTrainingResults(network: Network): void {
    console.log(`After ${network.getEpochsTrained()} epochs:`);
    network.getTrainingCases().forEach(dataset => {
      network.run(dataset.inputs);
      console.log(`For ${dataset.inputs}:`);
      let outputStringFormatted: string;
      if (Math.abs(dataset.expected[0] - network.getOutputLayerValues()[0]) < 0.1) {
        outputStringFormatted = chalk.bold.greenBright(network.getOutputLayerValues());
      } else {
        outputStringFormatted = chalk.bold.redBright(network.getOutputLayerValues());
      }
      console.log(chalk.bgAnsi256(235)(`  Expected ${chalk.bold(dataset.expected)} : got ${outputStringFormatted}`));
    });
  }
  
  type Color = [number, number, number];
  
  class Serie {
    public label: string;
    public color: Color = [255, 255, 255];
    public XVals: number[] = [];
    public offset = 0;
    public width = 0;
    public maxValue: number = 0;
    public minValue: number = 1;
    private plotter: Plotter;
    
    constructor(plotterParent: Plotter, label?: string, color?: Color) {
      this.label = label ? label : '';
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
      this.XVals.push(value);
      this.maxValue = (value > this.maxValue || this.maxValue === undefined) && value.toString() !== 'NaN' ? value : this.maxValue;
      this.minValue = (value < this.minValue || this.minValue === undefined) && value.toString() !== 'NaN' ? value : this.minValue;
      this.plotter.pointAdded(this.length);
    }
    
    get length(): number {
      return this.XVals.length;
    }
  }
  
  export function darkenColorRGB(color: Color, timesDarker: number): Color {
    return color.map(colorChannel => Math.round(colorChannel / timesDarker)) as Color;
  }
  
  export class Plotter {
    private series: Serie[] = [];
    private plotLength = 0;
    private consoleColumns = process.stdout.columns;
    private liveMode = true;
    
    private plotPoint(serie: Serie, lineIndex: number) {
      const darkerColor = darkenColorRGB(serie.color, 4);
      const value = serie.XVals[lineIndex];
      const previousValue = serie.XVals[lineIndex - 1];
      process.stdout.cursorTo(serie.offset);
      process.stdout.write('\u2502');
      if (value !== 0 && !value) {
        process.stdout.write('\u2219'.padStart(8, ' '));
        return;
      }
      const valueLabel = _.round(value, 3).toString().padEnd(7, ' ');
      let formattedLabel: string;
      if (value === serie.minValue) {
        formattedLabel = chalk.rgb(...serie.color)('\u25bc'.concat(valueLabel));
        process.stdout.moveCursor(-1, 0);
      } else if (value === serie.maxValue) {
        formattedLabel = chalk.rgb(...serie.color)('\u25b2'.concat(valueLabel));
        process.stdout.moveCursor(-1, 0);
      } else {
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
      } else if (difference < 0) {
        process.stdout.write(chalk.rgb(...darkerColor)(`${'\u2219'.repeat(normPreviousValue)}`));
        process.stdout.moveCursor(-1, 0);
        process.stdout.write(chalk.rgb(...serie.color)(`\u2514${'\u2500'.repeat(-1 * difference)}`));
        process.stdout.moveCursor(-1, 0);
        process.stdout.write(chalk.rgb(...serie.color)('\u2510'));
      } else {
        process.stdout.write(chalk.rgb(...darkerColor)(`${'\u2219'.repeat(normValue)}`));
        process.stdout.moveCursor(-1, 0);
        process.stdout.write(chalk.rgb(...serie.color)(`\u2502`));
      }
    }
    
    private plotLine(linePointsIndex: number): void {
      _.orderBy(this.series, (serie) => serie.XVals[linePointsIndex], 'desc');
      this.series.forEach(serie => {
        this.plotPoint(serie, linePointsIndex);
      });
      process.stdout.write('\n');
    }
    
    private scaleToFit(value: number, serie: Serie) {
      return Math.floor(value * ((serie.width - 10) / (serie.maxValue - serie.minValue)));
    }
    
    private levelOutPlots(fillLastLine = false): void {
      const mod = fillLastLine ? 0 : 1;
      this.series.forEach(serie => {
        while ((serie.length + mod) < this.plotLength) {
          serie.XVals.push(0); // previously pushed undefined - will it work with 0?
        }
      });
    }
    
    private drawLabelsAndStatsLine(): void {
      this.series.forEach(serie => {
        process.stdout.cursorTo(serie.offset);
        process.stdout.write(chalk.rgb(...serie.color)(`${serie.label} <${_.round(serie.minValue, 3)};${_.round(serie.maxValue, 3)}>`));
      });
      process.stdout.write('\n');
    }
    
    public addSerie(color?: Color, label?: string, ): Serie {
      const newSerie = new Serie(this, label, color);
      this.series.push(newSerie);
      const seriesWidth = Math.floor(this.consoleColumns / this.series.length);
      this.series.forEach((serie, index) => {
        serie.setOffset(seriesWidth * index);
        serie.setWidth(seriesWidth);
      });
      
      while (newSerie.length < this.plotLength) {
        newSerie.addPoint(0); // previously added undefined - will it work with 0?
      }
      
      return newSerie;
    }
    
    public pointAdded(serieLength: number) {
      this.plotLength = Math.max(this.plotLength, serieLength);
      if (this.liveMode && this.plotLength === serieLength) {
        this.levelOutPlots();
      }
      // this.plotLength = this.plotLength >= serieLength ? this.plotLength : serieLength;
    }
    
    public draw() {
      this.drawLabelsAndStatsLine();
      for (let i = 0; i < this.plotLength; ++i) {
        this.plotLine(i);
      }
      this.drawLabelsAndStatsLine();
    }
    
    public toggleLiveMode(): void {
      if (this.liveMode) {
        this.liveModeOff();
      } else {
        this.liveModeOn();
      }
    }
    
    public liveModeOn(): void {
      this.liveMode = true;
      this.levelOutPlots(true);
    }
    
    public liveModeOff(): void {
      this.liveMode = false;
      this.levelOutPlots(true);
    }
  }
  