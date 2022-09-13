import { ActivationFunctionsNames} from './libs/activationFunctions';
import { Network, NetworkSchema } from './classes/Network.class';
import { testData } from './interfaces/test-data.interface';
import { Plotter, showTrainingResults } from './libs/lab';


const data: testData[] = [
  {
      inputs: [1, 0],
      expected: [1]
  },
  {
      inputs: [0, 1],
      expected: [1]
  },
  {
      inputs: [1, 1],
      expected: [0]
  },
  {
      inputs: [0, 0],
      expected: [0]
  },
];

const networkSchema: NetworkSchema = {
  inputLayer: {
    neurons: [
      { activationFunctionName: ActivationFunctionsNames.bypass, bias: 0, name: 'INP #0' },
      { activationFunctionName: ActivationFunctionsNames.bypass, bias: 0, name: 'INP #1' },
    ],
  },
  hiddenLayers: [
    {
      neurons: [
        { activationFunctionName: ActivationFunctionsNames.sigmoid, bias: 1, learningFactor: 0.75, name: 'HID0 #0' },
        { activationFunctionName: ActivationFunctionsNames.sigmoid, bias: -1, learningFactor: 0.75, name: 'HID0 #1' },
      ],
    },
  ],
  outputLayer: {
    neurons: [
      { activationFunctionName: ActivationFunctionsNames.sigmoid, bias: 0, learningFactor: 0.75, name: 'OUT #0' },
    ],
  },
  trainingCases: data,
};

const network = new Network(networkSchema);

network.train(1000000, (network) => data.every(set => network.getError(set) < 0.0001));

network.getNetworkStatus(data[0]).layers.map(layer => Object.assign(layer, {neurons: layer.neurons.map(neuron => Object.assign(neuron, {incomingConnections: JSON.stringify(neuron.incomingConnections)}))})).forEach(layer => console.log(layer));

showTrainingResults(network);

// const plotter = new Plotter();
// plotter.addSerie(
//   [150, 150, 150],
//   'test',
// );
// plotter.pointAdded(1);
// plotter.draw();
