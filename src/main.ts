import { XORNetworkSchema, XORTrainDataset } from './xor';
import { getMeanNetworkError, showTrainingResults, Plotter, darkenColorRGB } from './lab';
import { Network } from './classes/Network.class';

const epochs = 300;
const times = 1000;

const XORNetwork = new Network(XORNetworkSchema);
XORNetwork.interlinkNeurons();
XORNetwork.setTrainingCases(XORTrainDataset);

showTrainingResults(XORNetwork);
console.log('\n');

const PlotterInst = new Plotter();

const outputNeuronInput = PlotterInst.addSerie([40, 200, 10], 'last neuron input');
const outputBias = PlotterInst.addSerie([200, 40, 10], 'bias');
const output = PlotterInst.addSerie([20, 210, 100], 'output');
const outputDelta = PlotterInst.addSerie([190, 30, 110], 'delta');
const outputDerrivative = PlotterInst.addSerie([40, 10, 200], 'derrivative');
const errorPlot = PlotterInst.addSerie([180, 10, 30], 'error');

const testToLogFor = 3;

console.log('\n');
const log1 = XORNetwork.getNetworkStatus(XORTrainDataset[testToLogFor]);
output.addPoint(log1.output[0]);
outputDelta.addPoint(log1.layers[log1.layers.length - 1].neurons[0].delta);
outputBias.addPoint(log1.layers[log1.layers.length - 1].neurons[0].bias);
outputDerrivative.addPoint(log1.layers[log1.layers.length - 1].neurons[0].activationDerivativeCalculation);
outputNeuronInput.addPoint(log1.layers[log1.layers.length - 1].neurons[0].inputsWeightedSum);
errorPlot.addPoint(log1.generalError);

for (let i = 0; i < times; ++i) {
    XORNetwork.train(epochs, (net) => getMeanNetworkError(net, XORTrainDataset) < 0.1);

    const log = XORNetwork.getNetworkStatus(XORTrainDataset[testToLogFor]);
    output.addPoint(log.output[0]);
    outputDelta.addPoint(log.layers[log.layers.length - 1].neurons[0].delta);
    outputBias.addPoint(log.layers[log.layers.length - 1].neurons[0].bias);
    outputDerrivative.addPoint(log.layers[log.layers.length - 1].neurons[0].activationDerivativeCalculation);
    outputNeuronInput.addPoint(log.layers[log.layers.length - 1].neurons[0].inputsWeightedSum);
    errorPlot.addPoint(log.generalError);
}

showTrainingResults(XORNetwork);

PlotterInst.draw();

showTrainingResults(XORNetwork);

console.log('\n=============================================\n');

// const serieBar = PlotterInst.addSerie('Bar', [190, 110, 20]);
// const serieBaz = PlotterInst.addSerie('Baz', [190, 20, 90]);

// serieFoo.addPoint(0);

// serieFoo.addPoint(-1 * 14.457);
// serieBar.addPoint(26);

// serieFoo.addPoint(-1 * 14.557);
// serieBar.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
// serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));

// serieBar.addPoint(26);
// serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));

// serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));

// serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));
// serieBar.addPoint(-1 * 6);

// serieBar.addPoint(0);
// serieFoo.addPoint(0);
// serieBaz.addPoint(0);

// serieBar.addPoint(0);
// serieFoo.addPoint(0);

// PlotterInst.liveModeOff();

// serieFoo.addPoint(16);
// serieFoo.addPoint(-1 * 12);
// serieFoo.addPoint(-1 * 1);
// serieFoo.addPoint(25);
// serieFoo.addPoint(10);
// serieFoo.addPoint(50);

// serieBar.addPoint(10);
// serieBar.addPoint(-1 * 25);
// serieBar.addPoint(14);
// serieBar.addPoint(47);

// serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
// serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));
// serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
// serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));
// serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
// serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));
// serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));

// PlotterInst.liveModeOn();

// serieBar.addPoint(50);
// serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));
// serieFoo.addPoint(-1 * 14.557);

// serieBar.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
// serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));

// PlotterInst.draw();
