import { Network } from './classes/Network.class';

export function getMeanNetworkError(net: Network, testData: testData[]) {
    return testData.reduce(
        (errorsSum, testCase) =>
            errorsSum + net.getError(testCase),
        0
    ) / testData.length;
}
