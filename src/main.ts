import { XORNetworkSchema, XORTrainDataset } from './xor';
import { getMeanNetworkError, showTrainingResults } from './lab';
import { Network } from './classes/Network.class';

const epochs = 20000;
const XORNetwork = new Network(XORNetworkSchema);
XORNetwork.interlinkNeurons();
XORNetwork.setTrainingCases(XORTrainDataset);

showTrainingResults(XORNetwork);
console.log('\n');

XORNetwork.train(epochs, (net) => getMeanNetworkError(net, XORTrainDataset) < 0.001);

showTrainingResults(XORNetwork);

console.log('\n=============================================\n');
