import { Network } from './classes/Network.class';
import * as chalk from 'chalk';

export function getMeanNetworkError(net: Network, testData: testData[]) {
    return testData.reduce(
        (errorsSum, testCase) =>
            errorsSum + net.getError(testCase),
        0
    ) / testData.length;
}

export function showTrainingResults(network: Network): void {
    network.getTrainingCases().forEach(dataset => {
        network.run(dataset.inputs);
        console.log(`After ${network.getEpochsTrained()} epochs for ${dataset.inputs}:`);
        let outputStringFormatted: string;
        if (Math.abs(dataset.expected[0] - network.getOutputLayerValues()[0]) < 0.1) {
            outputStringFormatted = chalk.bold.greenBright(network.getOutputLayerValues());
        } else {
            outputStringFormatted = chalk.bold.redBright(network.getOutputLayerValues());
        }
        console.log(chalk.bgAnsi256(235)(`Expected ${chalk.bold(dataset.expected)} : got ${outputStringFormatted}`));
    });
}
