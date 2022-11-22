import { Network } from './classes/Network.class';
import { showTrainingResults } from './libs/lab';
import { XORNetworkTemplate } from './network-templates/index';

const xorNetwork = new Network(XORNetworkTemplate.networkSchema);

xorNetwork.train(1000000, (trainedNetwork) => XORNetworkTemplate.trainingData.every(set => trainedNetwork.getError(set) < 0.0001));

xorNetwork.getNetworkStatus(XORNetworkTemplate.trainingData[0])
  .layers
  .map(
    layer =>
      Object.assign(
        layer,
        {
          neurons: layer.neurons.map(
            neuron =>
              Object.assign(
                neuron,
                {
                  incomingConnections: JSON.stringify(neuron.incomingConnections),
                }
              )
          ),
        }
      )
  )
  .forEach(layer => console.log(layer));

showTrainingResults(xorNetwork);

// const plotter = new Plotter();
// plotter.addSerie(
//   [150, 150, 150],
//   'test',
// );
// plotter.pointAdded(1);
// plotter.draw();
