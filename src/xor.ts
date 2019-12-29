import { NeuronSchema } from './classes/Neuron.class';
import { ActivationFunctions } from './libs/activationFunctions';
import { Network } from './classes/Network.class';
import { roundWithPrecision } from './utils';

const networkSchema: NeuronSchema[][] = [];

networkSchema.push([
    {
        activationFunctions: [ActivationFunctions.bypass],
        bias: 0,
        learningFactor: 10,
    },
    {
        activationFunctions: [ActivationFunctions.bypass],
        bias: 0,
        learningFactor: 10,
    },
]);

networkSchema.push([
    {
        activationFunctions: [ActivationFunctions.sigmoid],
        learningFactor: 10,
    },
    {
        activationFunctions: [ActivationFunctions.sigmoid],
        learningFactor: 10,
    },
]);

networkSchema.push([
    {
        activationFunctions: [ActivationFunctions.sigmoid],
        learningFactor: 10,
    },
]);

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


// function trainTimes(n: number) {
//     for (let i = 0; i < n; ++i) {
//         const dataSet = Math.floor(Math.random() * testData.length);
//         // const dataSet = trainingSetIndex;
//         network.setDataToWork(testData[dataSet].inputs);
//         network.run();
//         network.backpropagateError(testData[dataSet].expected);
//         network.learn();
//         if (network.getNetworkError(testData) <= 0.01 && epoch01Number === -1) {
//             epoch01Number = i;
//             break;
//         }
//     }
//     iterCounter += n;
// }

// const logs: string[][] = [];
// function midLog(): void {
//     console.log(`\n..:: after ${iterCounter} ::..\n`);

//     network.setDataToWork(testData[trainingSetIndex].inputs);
//     network.run();
//     network.backpropagateError(testData[trainingSetIndex].expected);
//     console.log('Input:', testData[trainingSetIndex].inputs);
//     console.log('Expected:', testData[trainingSetIndex].expected);
//     network.logNetworkOutput(`#${trainingSetIndex}`);
//     logs.push(network.getLayersStatus(logs.length === 0 ? 'before' : 'after'));

//     // network.setDataToWork(testData[0].inputs);
//     // network.run();
//     // network.backpropagateError(testData[0].expected);
//     // console.log("Input:", testData[0].inputs);
//     // console.log("Expected:", testData[0].expected);
//     // network.logNetworkOutput("#0");
//     // // network.getLayersStatus("#0");

//     network.setDataToWork(testData[1].inputs);
//     network.run();
//     network.backpropagateError(testData[1].expected);
//     console.log('Input:', testData[1].inputs);
//     console.log('Expected:', testData[1].expected);
//     network.logNetworkOutput('#1');
//     // network.getLayersStatus("#1");

//     network.setDataToWork(testData[2].inputs);
//     network.run();
//     network.backpropagateError(testData[2].expected);
//     console.log('Input:', testData[2].inputs);
//     console.log('Expected:', testData[2].expected);
//     network.logNetworkOutput('#2');
//     // network.getLayersStatus("#2");

//     network.setDataToWork(testData[3].inputs);
//     network.run();
//     network.backpropagateError(testData[3].expected);
//     console.log('Input:', testData[3].inputs);
//     console.log('Expected:', testData[3].expected);
//     network.logNetworkOutput('#3');
//     // network.getLayersStatus("#3");
// }

// midLog();
// trainTimes(100000);
// midLog();
interface Run {
    successEpoch: number;
    error: number;
    results: number[];
    network: Network;
}
const runs: Run[] = [];
let runsCount = 0;
const logs: string[][] = [];
function runNewNet() {
    iterCounter = 0;
    const network = new Network(networkSchema);
    network.interlinkNeurons();
    network.setTrainingCases(testData);
    network.train(100);
        network.run(testData[0].inputs);
        logs.push(network.getLayersStatus("after 100"));
    const successEpoch = network.train(20000, (net) => getMeanNetworkError(net, testData) < 0.001) + 100;
        network.run(testData[0].inputs);
        logs.push(network.getLayersStatus("after 20100"));
    runs.push({
        successEpoch: successEpoch,
        error: getMeanNetworkError(network, testData),
        results: network.getOutputLayerValues(),
        network
    });
    console.log('runsCount:', ++runsCount);
}

// tslint:disable-next-line: no-console
console.time('runs time');
// for (let i = 0; i < 100; ++i) {
    runNewNet();
// }
// tslint:disable-next-line: no-console
console.log('\x1b[33m');
// tslint:disable-next-line: no-console
console.timeEnd('runs time');
// tslint:disable-next-line: no-console
console.log('\x1b[0m');

function getMeanNetworkError(network: Network, testData: testData[]) {
    return testData.reduce(
        (errorsSum, testCase) =>
            errorsSum + network.getError(testCase),
        0
    ) / testData.length;
}

const failedRuns = runs.filter((run) => run.successEpoch === -1).length;
const meanErrorWithoutFailures = roundWithPrecision(
    runs.reduce(
        (err, run) => {
            return run.successEpoch === -1 ?
                err :
                err + run.error
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
                run.successEpoch === -1 ? epochsSum : epochsSum + run.successEpoch,
            0
        ) / (runs.length - failedRuns)
    );
const maxEpoch01 = runs.reduce(
    (maxEpoch, run) =>
        (maxEpoch > run.successEpoch && run.successEpoch > -1) ?
            maxEpoch :
            run.successEpoch,
    0
);
const minEpoch01 = runs.reduce(
    (minEpoch, run) =>
        (run.successEpoch < minEpoch && run.successEpoch > -1) ?
            run.successEpoch :
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

const colsSeparatorLength = 20;
let longestLine = 0;
logs.forEach(log => {
    log.forEach(logLine => {
        if(logLine.length > longestLine) longestLine = logLine.length;
    });
});

console.log("\n\ntrainingSetIndex:", trainingSetIndex);
logs[0].forEach((logLine, lineIndex) => {
    const lineLength = longestLine + colsSeparatorLength - 1;
    console.log(`${logLine.padEnd(lineLength)} ${logs[1][lineIndex].replace(/\n/g, " ")}`);
});
