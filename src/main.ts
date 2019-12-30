import { NetworkSchema, Network } from './classes/Network.class';
import { ActivationFunctions } from './libs/activationFunctions';

const networkSchema: NetworkSchema = [
    [
        {
            activationFunction: ActivationFunctions.bypass,
            bias: 0
        },
        {
            activationFunction: ActivationFunctions.bypass,
            bias: 0
        },
    ],
    [
        {
            activationFunction: ActivationFunctions.sigmoid,
        },
        {
            activationFunction: ActivationFunctions.sigmoid,
        },
    ], [
        {
            activationFunction: ActivationFunctions.sigmoid,
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
network.train(2000, (net) => getMeanNetworkError(net, testDataSet) < 0.001);
