import { Neuron } from './classes/neuron.class';
import { bias, sigmoid } from './libs/activationMethods';
import { Network } from './classes/network.class';

const networkSchema: Neuron[][] = [];

networkSchema[0] = [
    new Neuron(bias, 0),
    new Neuron(bias, 0),
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

const testData: testData[] = [
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
let iterCounter: number = 0;

function train(n: number) {
    for(let i = 0; i < n; ++i) {
        const dataSet = Math.floor(Math.random() * 4);
        network.setDataToWork(testData[dataSet].inputs);
        network.run();
        network.backpropagateError(testData[dataSet].expected);
        network.learn()
    }
    iterCounter += n;
}

function midLog(): void {
    console.log(`\n..:: after ${iterCounter} ::..\n`);
    network.setDataToWork(testData[0].inputs);
    network.run();
    network.backpropagateError(testData[0].expected);
    console.log("Input:", testData[0].inputs);
    console.log("Expected:", testData[0].expected);
    network.logNetworkOutput("#0");
    network.logLayersStatus("#0");
    
    network.setDataToWork(testData[1].inputs);
    network.run();
    network.backpropagateError(testData[1].expected);
    console.log("Input:", testData[1].inputs);
    console.log("Expected:", testData[1].expected);
    network.logNetworkOutput("#1");
    // network.logLayersStatus("#1");
    
    network.setDataToWork(testData[2].inputs);
    network.run();
    network.backpropagateError(testData[2].expected);
    console.log("Input:", testData[2].inputs);
    console.log("Expected:", testData[2].expected);
    network.logNetworkOutput("#2");
    // network.logLayersStatus("#2");
    
    network.setDataToWork(testData[3].inputs);
    network.run();
    network.backpropagateError(testData[3].expected);
    console.log("Input:", testData[3].inputs);
    console.log("Expected:", testData[3].expected);
    network.logNetworkOutput("#3");
    network.logLayersStatus("#3");
}

midLog();
train(10000);
midLog();