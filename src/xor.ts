import { Neuron } from './classes/neuron.class';
import { bias, sigmoid } from './libs/activationMethods';
import { Network } from './classes/network.class';

const networkSchema: Neuron[][] = [];

networkSchema[0] = [
    new Neuron(bias),
    new Neuron(bias),
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

network.setDataToWork(testData[0].inputs);
network.run();
network.learn(testData[0].expected);
network.logNetworkOutput("#0");
network.setDataToWork(testData[1].inputs);
network.run();
network.learn(testData[1].expected);
network.logNetworkOutput("#1");
network.setDataToWork(testData[2].inputs);
network.run();
network.learn(testData[2].expected);
network.logNetworkOutput("#2");
network.setDataToWork(testData[3].inputs);
network.run();
network.logNetworkOutput("#3");
network.learn(testData[3].expected);

console.log("\n..:: next ::..\n");

network.setDataToWork(testData[0].inputs);
network.run();
network.learn(testData[0].expected);
network.logNetworkOutput("#0");
network.setDataToWork(testData[1].inputs);
network.run();
network.learn(testData[1].expected);
network.logNetworkOutput("#1");
network.setDataToWork(testData[2].inputs);
network.run();
network.learn(testData[2].expected);
network.logNetworkOutput("#2");
network.setDataToWork(testData[3].inputs);
network.run();
network.logNetworkOutput("#3");
network.learn(testData[3].expected);

console.log("\n..:: next ::..\n");

network.setDataToWork(testData[0].inputs);
network.run();
network.learn(testData[0].expected);
network.logNetworkOutput("#0");
network.setDataToWork(testData[1].inputs);
network.run();
network.learn(testData[1].expected);
network.logNetworkOutput("#1");
network.setDataToWork(testData[2].inputs);
network.run();
network.learn(testData[2].expected);
network.logNetworkOutput("#2");
network.setDataToWork(testData[3].inputs);
network.run();
network.logNetworkOutput("#3");
network.learn(testData[3].expected);

console.log("\n..:: next ::..\n");

network.setDataToWork(testData[0].inputs);
network.run();
network.learn(testData[0].expected);
network.logNetworkOutput("#0");
network.setDataToWork(testData[1].inputs);
network.run();
network.learn(testData[1].expected);
network.logNetworkOutput("#1");
network.setDataToWork(testData[2].inputs);
network.run();
network.learn(testData[2].expected);
network.logNetworkOutput("#2");
network.setDataToWork(testData[3].inputs);
network.run();
network.logNetworkOutput("#3");
network.learn(testData[3].expected);