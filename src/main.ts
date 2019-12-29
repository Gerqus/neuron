import { NetworkSchema, Network } from "./classes/Network.class";
import { ActivationFunctions } from "./libs/activationFunctions";

const networkSchema: NetworkSchema = [
    [
        {
            activationFunctions: [ActivationFunctions.bypass],
            bias: 0
        },
        {
            activationFunctions: [ActivationFunctions.bypass],
            bias: 0
        },
    ],
    [
        {
            activationFunctions: [ActivationFunctions.sigmoid],
        },
        {
            activationFunctions: [ActivationFunctions.sigmoid],
        },
    ],[
        {
            activationFunctions: [ActivationFunctions.sigmoid],
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
function getMeanNetworkError(network: Network, testData: testData[]) {
    return testData.reduce(
        (errorsSum, testCase) =>
            errorsSum + network.getError(testCase),
        0
    ) / testData.length;
}
network.train(2000, (net) => getMeanNetworkError(net, testDataSet) < 0.001);