import { XORNetworkSchema, XORTrainDataset } from './xor';
import { getMeanNetworkError, showTrainingResults, Plotter, darkenColorRGB } from './lab';
import { Network } from './classes/Network.class';

// const epochs = 20000;
// const XORNetwork = new Network(XORNetworkSchema);
// XORNetwork.interlinkNeurons();
// XORNetwork.setTrainingCases(XORTrainDataset);

// showTrainingResults(XORNetwork);
// console.log('\n');

// XORNetwork.train(epochs, (net) => getMeanNetworkError(net, XORTrainDataset) < 0.001);

// showTrainingResults(XORNetwork);

// console.log('\n=============================================\n');

const PlotterInst = new Plotter();

const serieFoo = PlotterInst.addSerie('Foo', [20, 210, 100]);
const serieBar = PlotterInst.addSerie('Bar', [190, 110, 20]);
const serieBaz = PlotterInst.addSerie('Baz', [190, 20, 90]);

serieFoo.addPoint(0);
serieFoo.addPoint(-1 * 14.457);
serieFoo.addPoint(-1 * 14.557);
serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
serieFoo.addPoint(10);
serieBar.addPoint(26);
serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
serieFoo.addPoint(-1 * 15);
serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));
serieBar.addPoint(-1 * 6);
serieBar.addPoint(0);
serieBar.addPoint(-1 * 1);
serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
serieBar.addPoint(-1 * 10);
serieFoo.addPoint(-1 * 16);
serieFoo.addPoint(16);
serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));
serieFoo.addPoint(-1 * 12);
serieFoo.addPoint(-1 * 1);
serieBar.addPoint(10);
serieFoo.addPoint(25);
serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));
serieBaz.addPoint(-1 * (4 * Math.random()) ** (4 * Math.random()));
serieBar.addPoint(-1 * 25);
serieFoo.addPoint(10);
serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));
serieBar.addPoint(14);
serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));
serieBar.addPoint(47);
serieFoo.addPoint(50);
serieBar.addPoint(50);
serieBaz.addPoint((4 * Math.random()) ** (4 * Math.random()));

PlotterInst.draw();
