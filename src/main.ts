import { XORNetworkSchema, XORTrainDataset } from './xor';
import { getMeanNetworkError } from './lab';
import { Network } from './classes/Network.class';

const epochs = 20000;

const XORNetwork = new Network(XORNetworkSchema);
XORNetwork.interlinkNeurons();
XORNetwork.setTrainingCases(XORTrainDataset);
XORNetwork.train(epochs, (net) => getMeanNetworkError(net, XORTrainDataset) < 0.001);

XORNetwork.run(XORTrainDataset[0].inputs);
XORNetwork.getLayersStatus(`after ${epochs} for ${XORTrainDataset[0].inputs}`).forEach((logLine) => console.log(logLine));

XORNetwork.run(XORTrainDataset[2].inputs);
XORNetwork.getLayersStatus(`after ${epochs} for ${XORTrainDataset[2].inputs}`).forEach((logLine) => console.log(logLine));

console.log('\n\n\n\n\n=============================================\n\n\n\n\n');
