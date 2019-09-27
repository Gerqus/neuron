import { Neuron } from './classes/neuron.class';
import { bias, sigmoid } from './libs/activationMethods';
import { Connection } from './classes/connection.class';
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

const network = new Network(networkSchema)

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

function interlinkNeurons() {
    layers.forEach((layer, layerNum) => {
        if (layerNum === 0) {
            return;
        }

        layer.forEach((currentNeuron) => {
            layers[layerNum - 1].forEach((inputNeuron) => {
                currentNeuron.connect(inputNeuron, Math.random());
            });
        });
    });
}

function run() {
    testData.forEach((dataSet, testIndex) => {
        if (layers[0].length !== dataSet.inputs.length) {
            throw new Error('Input data points count doesn\'t match input neurons count. Terminating...');
        }

        dataSet.inputs.forEach((value, index) => {
            layers[0][index].state = value;
        });
    
        layers.forEach((layer, layerIndex) => {
            if (layerIndex == 0) return;
            layer.forEach(neuron => neuron.activate());
        });

        console.log(`Output for test#${testIndex}:`);
        layers[layers.length - 1].forEach((neuron, index) => console.log(`Neuron#${index}: ${neuron.state}`));
    });
}

function learn() {
    testData.forEach(dataSet => {
        if (layers[0].length !== dataSet.inputs.length) {
            throw new Error('Input data points count doesn\'t match input neurons count. Terminating...');
        }

        dataSet.inputs.forEach((value, index) => {
            layers[0][index].state = value;
        });

        layers.forEach(layer => {
            layer.forEach(neuron => neuron.activate());
        });

        layers.forEach(layer => {
            layer.forEach(neuron => neuron.activate());
        });
    });
}

interlinkNeurons();
run();
learn();
