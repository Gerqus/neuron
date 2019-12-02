import { Neuron } from './classes/Neuron.class';
import { bypass, sigmoid, bipolarSigmoid } from './libs/activationMethods';
import { Network } from './classes/Network.class';

const networkSchema: Neuron[][] = [];

networkSchema[0] = [
    new Neuron(bypass, 0),
    new Neuron(bypass, 0),
];

networkSchema[1] = [
    new Neuron(sigmoid),
    new Neuron(sigmoid),
];

networkSchema[2] = [
    new Neuron(sigmoid),
];

let network = new Network(networkSchema);
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
const trainingSetIndex = 0;
let epoch01Number = -1;
let iterCounter = 0;

function trainTimes(n: number) {
    for (let i = 0; i < n; ++i) {
        const dataSet = Math.floor(Math.random() * testData.length);
        // const dataSet = trainingSetIndex;
        network.setDataToWork(testData[dataSet].inputs);
        network.run();
        network.backpropagateError(testData[dataSet].expected);
        network.learn();
        if (network.getNetworkError(testData) <= 0.01 && epoch01Number === -1) {
            epoch01Number = i;
            break;
        }
    }
    iterCounter += n;
}

const logs: string[][] = [];
function midLog(): void {
    console.log(`\n..:: after ${iterCounter} ::..\n`);

    network.setDataToWork(testData[trainingSetIndex].inputs);
    network.run();
    network.backpropagateError(testData[trainingSetIndex].expected);
    console.log('Input:', testData[trainingSetIndex].inputs);
    console.log('Expected:', testData[trainingSetIndex].expected);
    network.logNetworkOutput(`#${trainingSetIndex}`);
    logs.push(network.getLayersStatus(logs.length === 0 ? 'before' : 'after'));

    // network.setDataToWork(testData[0].inputs);
    // network.run();
    // network.backpropagateError(testData[0].expected);
    // console.log("Input:", testData[0].inputs);
    // console.log("Expected:", testData[0].expected);
    // network.logNetworkOutput("#0");
    // // network.getLayersStatus("#0");

    network.setDataToWork(testData[1].inputs);
    network.run();
    network.backpropagateError(testData[1].expected);
    console.log('Input:', testData[1].inputs);
    console.log('Expected:', testData[1].expected);
    network.logNetworkOutput('#1');
    // network.getLayersStatus("#1");

    network.setDataToWork(testData[2].inputs);
    network.run();
    network.backpropagateError(testData[2].expected);
    console.log('Input:', testData[2].inputs);
    console.log('Expected:', testData[2].expected);
    network.logNetworkOutput('#2');
    // network.getLayersStatus("#2");

    network.setDataToWork(testData[3].inputs);
    network.run();
    network.backpropagateError(testData[3].expected);
    console.log('Input:', testData[3].inputs);
    console.log('Expected:', testData[3].expected);
    network.logNetworkOutput('#3');
    // network.getLayersStatus("#3");
}

// midLog();
// trainTimes(100000);
// midLog();
interface Run {
    epoch01: number;
    error: number;
    results: number[];
    network: Network;
}
const runs: Run[] = [];
let runsCount = 0;
function runNewNet() {
    epoch01Number = -1;
    iterCounter = 0;
    networkSchema[0] = [
        new Neuron(bypass, 0),
        new Neuron(bypass, 0),
    ];

    networkSchema[1] = [
        new Neuron(sigmoid),
        new Neuron(sigmoid),
    ];

    networkSchema[2] = [
        new Neuron(sigmoid),
    ];
    network = new Network(networkSchema);
    network.interlinkNeurons();
    trainTimes(5000);
    runs.push({
        epoch01: epoch01Number,
        error: network.getNetworkError(testData),
        results: network.getOutputLayerValues(),
        network
    });
    console.log('runsCount:', runsCount++);
}

// tslint:disable-next-line: no-console
console.time('runs time');
for (let i = 0; i < 100; ++i) {
    runNewNet();
}
// tslint:disable-next-line: no-console
console.timeEnd('runs time');

function roundWithPrecision(value: number, precision: number = 2): number {
    const mult = Math.pow(10, precision);

    return Math.round(value * mult) / mult;
}

const failedRuns = runs.filter((run) => run.epoch01 === -1).length;
const meanErrorWithoutFailures = roundWithPrecision(
    runs.reduce(
        (err, run, i) => {
            return run.epoch01 === -1 ?
                err :
                err + run.network.getNetworkError(testData);
        },
        0
    ) / (runs.length - failedRuns),
    4
);
const failedRunsRate = roundWithPrecision(failedRuns / runs.length);
const meanEpoch01WithoutFailures =
    Math.round(
        runs.reduce(
            (epochsSum, run) =>
                run.epoch01 === -1 ? epochsSum : epochsSum + run.epoch01,
            0
        ) / (runs.length - failedRuns)
    );
const maxEpoch01 = runs.reduce(
    (maxEpoch, run) =>
        (maxEpoch > run.epoch01 && run.epoch01 > -1) ?
            maxEpoch :
            run.epoch01,
    0
);
const minEpoch01 = runs.reduce(
    (minEpoch, run) =>
        (run.epoch01 < minEpoch && run.epoch01 > -1) ?
            run.epoch01 :
            minEpoch,
    maxEpoch01
);
console.log('Runs summary:');
console.log('meanErrorWithoutFailures:', meanErrorWithoutFailures * 100, '%');
console.log('meanEpoch01WithoutFailures:', meanEpoch01WithoutFailures);
console.log('min epoch01:', minEpoch01);
console.log('max epoch01:', maxEpoch01);
console.log('allRuns:', runs.length);
console.log('failedRuns:', failedRuns);
console.log('failedRunsRate:', failedRunsRate * 100, '%');

// const colsSeparatorLength = 20;
// let longestLine = 0;
// logs.forEach(log => {
//     log.forEach(logLine => {
//         if(logLine.length > longestLine) longestLine = logLine.length;
//     });
// });

// console.log("\n\ntrainingSetIndex:", trainingSetIndex);
// logs[0].forEach((logLine, lineIndex) => {
//     const lineLength = longestLine + colsSeparatorLength - 1;
//     console.log(`${logLine.padEnd(lineLength)} ${logs[1][lineIndex].replace(/\n/g, " ")}`);
// });
