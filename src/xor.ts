import { NetworkSchema, Network } from './classes/Network.class';
import { ActivationFunctions } from './libs/activationFunctions';

const networkSchema: NetworkSchema = [
    [
        {
            activationFunction: ActivationFunctions.bypass,
            bias: 0,
            learningFactor: 10,
        },
        {
            activationFunction: ActivationFunctions.bypass,
            bias: 0,
            learningFactor: 10,
        },
    ],
    [
        {
            activationFunction: ActivationFunctions.sigmoid,
            learningFactor: 10,
        },
        {
            activationFunction: ActivationFunctions.sigmoid,
            learningFactor: 10,
        },
    ], [
        {
            activationFunction: ActivationFunctions.sigmoid,
            learningFactor: 10,
        },
    ],
];

const network = new Network(networkSchema);
network.interlinkNeurons();

const testDataSet: testData[] = [
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

network.setTrainingCases(testDataSet);
function getMeanNetworkError(net: Network, testData: testData[]) {
    return testData.reduce(
        (errorsSum, testCase) =>
            errorsSum + net.getError(testCase),
        0
    ) / testData.length;
}
const epochs = 20000;
network.train(epochs, (net) => getMeanNetworkError(net, testDataSet) < 0.001);

network.run(testDataSet[0].inputs);
network.getLayersStatus(`after ${epochs} for ${testDataSet[0].inputs}`).forEach((logLine) => console.log(logLine));

network.run(testDataSet[2].inputs);
network.getLayersStatus(`after ${epochs} for ${testDataSet[2].inputs}`).forEach((logLine) => console.log(logLine));

console.log('\n\n\n\n\n=============================================\n\n\n\n\n')