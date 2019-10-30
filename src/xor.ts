import { Neuron } from './classes/neuron.class';
import { bias, sigmoid } from './libs/activationMethods';
import { Network } from './classes/network.class';

const networkSchema: Neuron[][] = [];

networkSchema[0] = [
    new Neuron(bias),
    new Neuron(bias),
]

networkSchema[1] = [
    new Neuron(sigmoid),
    new Neuron(sigmoid),
]

networkSchema[2] = [
    new Neuron(sigmoid),
]

const network = new Network(networkSchema);
network.interlinkNeurons();

const testData: dataset[] = [
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

network.setDataToWork(testData);
network.logLayersStatus("before run");
network.run();
network.learn();