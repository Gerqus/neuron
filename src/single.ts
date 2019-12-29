import { NeuronSchema } from './classes/Neuron.class';
import { ActivationFunctions } from './libs/activationFunctions';
import { Network } from './classes/Network.class';

const networkSchema: NeuronSchema[][] = [];

networkSchema.push([
    {
        activationFunctions: [ActivationFunctions.bypass],
        bias: 0
    },
]);

networkSchema.push([
    {
        activationFunctions: [ActivationFunctions.sigmoid],
    },
]);

const network = new Network(networkSchema);
network.interlinkNeurons();

const testData: testData[] = [
    {
        inputs: [1],
        expected: [1]
    },
    {
        inputs: [0],
        expected: [0]
    },
];
let iterCounter = 0;

function trainTimes(n: number) {
    for (let i = 0; i < n; ++i) {
        const dataSet = Math.floor(Math.random() * testData.length);
        network.setDataToWork(testData[dataSet].inputs);
        network.run();
        network.backpropagateError(testData[dataSet].expected);
        network.learn();
    }
    iterCounter += n;
}

const logs: string[][] = [];

function midLog(): void {
    console.log(`\n..:: after ${iterCounter} ::..\n`);
    network.setDataToWork(testData[0].inputs);
    network.run();
    network.backpropagateError(testData[0].expected);
    console.log('Input:', testData[0].inputs);
    console.log('Expected:', testData[0].expected);
    network.logNetworkOutput('#0');
    logs.push(network.getLayersStatus(logs.length === 0 ? 'before' : 'after'));

    // network.setDataToWork(testData[1].inputs);
    // network.run();
    // network.backpropagateError(testData[1].expected);
    // console.log("Input:", testData[1].inputs);
    // console.log("Expected:", testData[1].expected);
    // network.logNetworkOutput("#1");
    // network.getLayersStatus("#1");

    // network.setDataToWork(testData[2].inputs);
    // network.run();
    // network.backpropagateError(testData[2].expected);
    // console.log("Input:", testData[2].inputs);
    // console.log("Expected:", testData[2].expected);
    // network.logNetworkOutput("#2");
    // network.getLayersStatus("#2");

    // network.setDataToWork(testData[3].inputs);
    // network.run();
    // network.backpropagateError(testData[3].expected);
    // console.log("Input:", testData[3].inputs);
    // console.log("Expected:", testData[3].expected);
    // network.logNetworkOutput("#3");
    // network.getLayersStatus("#3");
}

midLog();
trainTimes(1000);
midLog();
const colsSeparatorLength = 20;
let longestLine = 0;
logs.forEach(log => {
    log.forEach(logLine => {
        if (logLine.length > longestLine) { longestLine = logLine.length; }
    });
});

logs[0].forEach((logLine, lineIndex) => {
    const lineLength = longestLine + colsSeparatorLength - 1;
    console.log(`${logLine.padEnd(lineLength)} ${logs[1][lineIndex].replace(/\n/g, ' ')}`);
});
