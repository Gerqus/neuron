"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Layer_class_1 = require("./Layer.class");
const utils_1 = require("../utils");
const errorFunctions_1 = require("../libs/errorFunctions");
const lab_1 = require("../lab");
const activationFunctions_1 = require("../libs/activationFunctions");
const _ = require("lodash");
class Network {
    constructor(schema, linkingFunction) {
        this.layers = [];
        this.epochsTrained = 0;
        this.indexedNeurons = {};
        if (!schema.inputLayer || !schema.outputLayer) {
            throw new Error('Network must have input and output layers. Terminating...');
        }
        if (!schema.inputLayer.neurons.length ||
            !schema.outputLayer.neurons.length ||
            _.some(schema.hiddenLayers, (layer) => layer.neurons.length === 0)) {
            throw new Error('All declared layers must have neurons. Terminating...');
        }
        const neuronsSchemas = [];
        this.addLayer(new Layer_class_1.Layer(schema.inputLayer));
        neuronsSchemas.push(...schema.inputLayer.neurons);
        if (schema.hiddenLayers) {
            schema.hiddenLayers.forEach((layerSchema) => {
                this.addLayer(new Layer_class_1.Layer(layerSchema));
                neuronsSchemas.push(...layerSchema.neurons);
            });
        }
        this.addLayer(new Layer_class_1.Layer(schema.outputLayer));
        neuronsSchemas.push(...schema.outputLayer.neurons);
        this.epochsTrained = schema.epochsTrained ? schema.epochsTrained : 0;
        this.trainingCases = schema.trainingCases ? schema.trainingCases : [];
        const createdNeurons = this.layers.reduce((neurons, layer) => neurons.concat(layer.getNeurons()), []);
        this.interlinkNeurons(createdNeurons, neuronsSchemas, linkingFunction);
    }
    interlinkNeurons(neurons, neuronsSchemas, linkingFunction) {
        if (linkingFunction) {
            linkingFunction(this.getLayers());
        }
        else {
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
                if (neuronSchema.incomingConnectionsSchemas) {
                    neuronSchema.incomingConnectionsSchemas.forEach((incomingConnection) => {
                        this.indexedNeurons[neuronSchema.name].connect(this.indexedNeurons[incomingConnection.inputNeuronName], incomingConnection.weight);
                    });
                }
            });
        }
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
            outputNeuron.increaseCostsSum(errorFunctions_1.ErrorFunctions.MSE.derivative(this.chosenTrainingSet.expected[neuronIndex], outputNeuron.getState()));
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
        return this.getOutputLayerValues().reduce((sqSum, output, outputIndex) => sqSum + errorFunctions_1.ErrorFunctions.MSE(testCase.expected[outputIndex], output), 0) / testCase.expected.length;
    }
    getNetworkStatus(trainingData) {
        this.run(trainingData.inputs);
        const log = {
            layers: [],
            epochs: this.epochsTrained,
            generalError: lab_1.getMeanNetworkError(this, this.trainingCases),
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
                    weight: utils_1.roundWithPrecision(conn.weight, 6),
                    state: conn.inputNeuron.getState(),
                }));
                const neuronLog = {
                    index: neuronIndex,
                    state: neuron.getState(),
                    bias: neuron.getBias(),
                    incomingConnections: connectionsWeights,
                    inputsWeightedSum: neuron.getInputsWeightedSum(),
                    output: (activationFunctions_1.ActivationFunctions[neuron.getActivationFunctionName()])(neuron.getInputsWeightedSum()),
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
    saveNetworkToSchema() {
        const network = {
            inputLayer: this.getInputLayer().saveLayerToSchema(),
            hiddenLayers: this.getHiddenLayers().map(layer => layer.saveLayerToSchema()),
            outputLayer: this.getOutputLayer().saveLayerToSchema(),
            epochsTrained: this.epochsTrained,
            trainingCases: this.trainingCases,
        };
        return JSON.stringify(network);
    }
    addLayer(layer) {
        this.layers.push(layer);
    }
    drawTestDataToWork() {
        this.chosenTrainingSet = utils_1.getRandomElement(this.trainingCases);
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
exports.Network = Network;
//# sourceMappingURL=Network.class.js.map