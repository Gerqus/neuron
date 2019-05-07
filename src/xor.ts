import { Neuron } from "./classes/neuron.class";
import { bias, sigmoid } from "./libs/activationMethods";

const layers: Neuron[][] = [];

layers[0] = [
    new Neuron(bias),
    new Neuron(bias),
]

layers[1] = [
    new Neuron(sigmoid),
    new Neuron(sigmoid),
]

layers[2] = [
    new Neuron(sigmoid),
]

const testData: dataset[] = [
    {
        inputs: [1, 0],
        expected: 1
    },
    {
        inputs: [0, 1],
        expected: 1
    },
    {
        inputs: [1, 1],
        expected: 0
    },
    {
        inputs: [0, 0],
        expected: 0
    },
];

function netNeurons() {
    layers.forEach((layer, layerNum) => {
        if (layerNum === 0) {
            return;
        }

        layer.forEach((currentNeuron) => {
            layers[layerNum - 1].forEach((inputNeuron) => {
                currentNeuron.connect(inputNeuron, (Math.random() + 1) / 2);
            });
        });
    });
}

function run() {
    testData.forEach(dataSet => {
        if (layers[0].length != dataSet.inputs.length) {
            throw new Error('Input data points count doesn\'t match input neurons count. Terminating...');
        }

        dataSet.inputs.forEach((value, index) => {
            layers[0][index].state = value;
        });

        layers.forEach(layer => {
            layer.forEach(neuron => neuron.activate());
        });
    });

    console.log('Output:');
    layers[layers.length-1].forEach((neuron, index) => console.log(`Output #${index}: ${neuron.state}`));
}

netNeurons();
run();
