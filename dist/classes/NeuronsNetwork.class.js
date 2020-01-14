"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Neuron_class_1 = require("./Neuron.class");
class NeuronsNetwork {
    constructor(schema) {
        this.neurons = [];
        this.epochsTrained = 0;
        this.indexedNeurons = {};
        if (!schema.neurons.length) {
            throw new Error('Network must have at least one neuron. Terminating...');
        }
        this.epochsTrained = schema.epochsTrained ? schema.epochsTrained : 0;
        this.trainingCases = schema.trainingCases ? schema.trainingCases : [];
        schema.neurons.forEach(neuronSchema => {
            this.neurons.push(new Neuron_class_1.Neuron(neuronSchema));
        });
        this.interlinkNeurons(this.neurons, schema.neurons);
    }
    interlinkNeurons(neurons, neuronsSchemas) {
        neurons.forEach((neuron) => {
            const neuronName = neuron.getName();
            if (!neuronName) {
                return;
            }
            if (neuronName in this.indexedNeurons) {
                throw new Error(`Duplicated neuron name "${neuronName}". Terminating...`);
            }
            this.indexedNeurons[neuronName] = neuron;
        });
        neuronsSchemas.forEach((neuronSchema) => {
            neuronSchema.incomingConnectionsNames.forEach((incomingConnectionName) => {
                this.indexedNeurons[neuronSchema.name].connect(this.indexedNeurons[incomingConnectionName]);
            });
        });
    }
    setTrainingCases(trainingCases) {
        let errorFound = false;
        trainingCases.forEach((testCase, testCaseIndex) => {
            if (testCase.inputs.length !== this.getInputLayer().getNeuronsCount()) {
                console.error(`Expected network inputs for test case #${testCaseIndex} count doesn\'t match input neurons count (${testCase.expected.length} !== ${this.getOutputLayer().getNeuronsCount()}). Terminating...`);
                errorFound = true;
            }
            if (testCase.expected.length !== this.getOutputLayer().getNeuronsCount()) {
                console.error(`Expected network outputs for test case #${testCaseIndex} count doesn\'t match output neurons count (${testCase.expected.length} !== ${this.getOutputLayer().getNeuronsCount()}). Terminating...`);
                errorFound = true;
            }
        });
        if (errorFound) {
            throw new Error('Data model doesn\'t match network topology! Terminating...');
        }
        this.trainingCases = trainingCases;
    }
    getTrainingCases() {
        return this.trainingCases;
    }
    run(inputData) {
        this.setInputLayerValues(inputData);
        this.getWorkingLayers().forEach(layer => {
            layer.activateNeurons();
        });
    }
    train(epochs, successConditionFunction) {
        for (let i = 0; i < epochs; ++i) {
            this.drawTestDataToWork();
            this.run(this.chosenTrainingSet.inputs);
            this.backpropagateError();
            this.learn();
            ++this.epochsTrained;
            if (successConditionFunction && successConditionFunction(this)) {
                return i;
            }
        }
        return -1;
    }
    logNetworkOutput(runLabel) {
        console.log(`Output from last run (${runLabel}):`);
        this.getOutputLayerValues().forEach((neuronState, index) => console.log(`Neuron#${index}: ${neuronState}`));
    }
    backpropagateError() {
        this.layers.forEach(layer => {
            layer.getNeurons().forEach(neuron => {
                neuron.clearErrorRates();
            });
        });
        this.getOutputLayer().getNeurons().forEach((outputNeuron, neuronIndex) => {
            outputNeuron.increaseCostsSum(ErrorFunctions.MSE.derivative(this.chosenTrainingSet.expected[neuronIndex], outputNeuron.getState()));
        });
        this.getWorkingLayers()
            .reverse()
            .forEach((currentLayer, layerIndex) => {
            currentLayer.getNeurons().forEach((neuron) => {
                neuron.calculateDelta();
                neuron.getConnections().forEach(connection => {
                    connection.inputNeuron.increaseCostsSum(connection.weight * neuron.getDelta());
                });
            });
        });
    }
    learn() {
        this.getWorkingLayers().forEach(currentLayer => {
            currentLayer.getNeurons().forEach(neuron => {
                neuron.updateConnectionsWeights();
                neuron.updateBias();
            });
        });
    }
    getOutputLayerValues() {
        return this.getOutputLayer().getNeurons().map(neuron => neuron.getState());
    }
    getError(testCase) {
        this.run(testCase.inputs);
        return this.getOutputLayerValues().reduce((sqSum, output, outputIndex) => sqSum + ErrorFunctions.MSE(testCase.expected[outputIndex], output), 0) / testCase.expected.length;
    }
    getNetworkStatus(trainingData) {
        this.run(trainingData.inputs);
        const log = {
            layers: [],
            epochs: this.epochsTrained,
            generalError: getMeanNetworkError(this, this.trainingCases),
            error: this.getError(trainingData),
            output: this.getOutputLayerValues(),
        };
        this.layers.forEach((layer, layerIndex) => {
            const layerLog = {
                layerIndex: layerIndex,
                neurons: [],
            };
            layer.getNeurons().forEach((neuron, neuronIndex) => {
                const connectionsWeights = neuron.getConnections().map((conn) => ({
                    weight: roundWithPrecision(conn.weight, 6),
                    state: conn.inputNeuron.getState(),
                }));
                const neuronLog = {
                    index: neuronIndex,
                    state: neuron.getState(),
                    bias: neuron.getBias(),
                    incomingConnections: connectionsWeights,
                    inputsWeightedSum: neuron.getInputsWeightedSum(),
                    output: ActivationFunctions[neuron.getActivationFunctionName()](neuron.getInputsWeightedSum()),
                    costsSum: neuron.getCostsSum(),
                    activationDerivativeCalculation: neuron.getDelta() / neuron.getCostsSum(),
                    delta: neuron.getDelta(),
                };
                layerLog.neurons[neuronIndex] = neuronLog;
            });
            log.layers.push(layerLog);
        });
        return log;
    }
    getEpochsTrained() {
        return this.epochsTrained;
    }
    dumpNetworkToSchema() {
        const network = {
            inputLayer: this.getInputLayer(),
            hiddenLayers: this.getHiddenLayers(),
            outputLayer: this.getOutputLayer(),
            epochsTrained: this.epochsTrained,
            trainingCases: this.trainingCases,
        };
        return JSON.stringify(network);
    }
    addLayer(layer) {
        this.layers.push(layer);
    }
    drawTestDataToWork() {
        this.chosenTrainingSet = getRandomElement(this.trainingCases);
    }
    setTestDataToWork(testSetIndex) {
        this.chosenTrainingSet = this.trainingCases[testSetIndex];
    }
    getInputLayer() {
        return this.layers[0];
    }
    getHiddenLayers() {
        return this.layers.slice(1, this.layers.length - 1);
    }
    getOutputLayer() {
        return this.layers[this.layers.length - 1];
    }
    getWorkingLayers() {
        return this.layers.slice(1, this.layers.length);
    }
    getLayers() {
        return this.layers;
    }
    setInputLayerValues(inputData) {
        this.getInputLayer().setNeuronsValues(inputData);
    }
}
exports.NeuronsNetwork = NeuronsNetwork;
//# sourceMappingURL=NeuronsNetwork.class.js.map