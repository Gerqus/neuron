import { Layer } from './Layer.class';
import { NeuronSchema, Neuron } from './Neuron.class';
import { LinkingFunctionSchema } from './LinkingFunction.class';
import { getRandomElement, roundWithPrecision } from '../utils';
import { ErrorFunctions } from '../libs/errorFunctions';
import { getMeanNetworkError } from '../lab';
import { ActivationFunctions, ActivationFunctionSchema } from '../libs/activationFunctions';
import * as _ from 'lodash';

interface ConnectionLog {
    weight: number;
    state: number;
}

interface NeuronLog {
    index: number;
    state: number;
    bias: number;
    incomingConnections: ConnectionLog[];
    inputsWeightedSum: number;
    output: number;
    costsSum: number;
    activationDerivativeCalculation: number;
    delta: number;
}

interface LayerLog {
    layerIndex: number;
    neurons: NeuronLog[];
}

interface NetworkLog {
    output: number[];
    layers: LayerLog[];
    epochs: number;
    generalError: number;
    error: number;
}

export interface NetworkSchema {
    inputLayer: NeuronSchema[];
    hiddenLayers?: NeuronSchema[][];
    outputLayer:  NeuronSchema[];
    epochsTrained?: number;
    trainingCases?: testData[];
}

interface IndexedNeurons {
    [name: string]: Neuron;
}

export type WorkingLayers = Layer[];

export class Network {
    private layers: Layer[] = [];
    private chosenTrainingSet: testData;
    private trainingCases: testData[];
    private epochsTrained = 0;
    private indexedNeurons: IndexedNeurons = {};

    constructor(schema: NetworkSchema, linkingFunction?: LinkingFunctionSchema) {
        if (!schema.inputLayer || !schema.outputLayer) {
            throw new Error('Network must have input and output layers. Terminating...');
        }
        if (!schema.inputLayer.length || !schema.outputLayer.length || _.some(schema.hiddenLayers, (layer) => layer.length === 0)) {
            throw new Error('All declared layers must have neurons. Terminating...');
        }

        const neuronsSchemas: NeuronSchema[] = [];

        this.addLayer(new Layer(schema.inputLayer));
        neuronsSchemas.push(...schema.inputLayer);
        if (schema.hiddenLayers) {
            schema.hiddenLayers.forEach((layerSchema) => {
                this.addLayer(new Layer(layerSchema));
                neuronsSchemas.push(...layerSchema);
            });
        }
        this.addLayer(new Layer(schema.outputLayer));
        neuronsSchemas.push(...schema.outputLayer);

        this.epochsTrained = schema.epochsTrained ? schema.epochsTrained : 0;
        this.trainingCases = schema.trainingCases ? schema.trainingCases : [];

        const createdNeurons = this.layers.reduce(
            (neurons: Neuron[], layer) =>
                neurons.concat(layer.getNeurons()),
            []
        );

        this.interlinkNeurons(createdNeurons, neuronsSchemas, linkingFunction);
    }

    private interlinkNeurons(neurons: Neuron[], neuronsSchemas: NeuronSchema[], linkingFunction?: LinkingFunctionSchema): void {
        if (linkingFunction) {
            linkingFunction(this.getLayers());
        } else {
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
                if (neuronSchema.incomingConnectionsNames) {
                    neuronSchema.incomingConnectionsNames.forEach((incomingConnectionName) => {
                        this.indexedNeurons[neuronSchema.name].connect(this.indexedNeurons[incomingConnectionName]);
                    });
                }
            });
        }
    }

    public setTrainingCases(trainingCases: testData[]): void {
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

    public getTrainingCases(): testData[] {
        return this.trainingCases;
    }

    public run(inputData: dataset): void {
        this.setInputLayerValues(inputData);

        this.getWorkingLayers().forEach(layer => {
            layer.activateNeurons();
        });
    }

    public train(epochs: number, successConditionFunction?: (net: Network) => boolean): number {
        for (let i = 0; i < epochs; ++i) {
            this.drawTestDataToWork();
            this.run(this.chosenTrainingSet.inputs);
            this.backpropagateError();
            this.learn();

            ++this.epochsTrained;

            if (successConditionFunction && successConditionFunction(this)) { // success
                return i;
            }
        }
        return -1; // break condition never met
    }

    public logNetworkOutput(runLabel?: string): void {
        console.log(`Output from last run (${runLabel}):`);
        this.getOutputLayerValues().forEach(
            (neuronState, index) => console.log(`Neuron#${index}: ${neuronState}`)
        );
    }

    public backpropagateError(): void {
        this.layers.forEach(layer => {
            layer.getNeurons().forEach(neuron => {
                neuron.clearErrorRates();
            });
        });

        this.getOutputLayer().getNeurons().forEach((outputNeuron, neuronIndex) => {
            outputNeuron.increaseCostsSum(ErrorFunctions.MSE.derivative(
                this.chosenTrainingSet.expected[neuronIndex],
                outputNeuron.getState()
            ));
        });

        this.getWorkingLayers()
            .reverse() // will work from end, since it's BACKpropagation
            .forEach((currentLayer, layerIndex) => {
                currentLayer.getNeurons().forEach((neuron) => {
                    neuron.calculateDelta();
                    neuron.getConnections().forEach(connection => {
                        connection.inputNeuron.increaseCostsSum(connection.weight * neuron.getDelta());
                    });
                });
            });
    }

    public learn(): void {
        this.getWorkingLayers().forEach(currentLayer => {
            currentLayer.getNeurons().forEach(neuron => {
                neuron.updateConnectionsWeights();
                neuron.updateBias();
            });
        });
    }

    public getOutputLayerValues(): number[] {
        return this.getOutputLayer().getNeurons().map(neuron => neuron.getState());
    }

    public getError(testCase: testData): number {
        this.run(testCase.inputs);
        return this.getOutputLayerValues().reduce(
            (sqSum, output, outputIndex) =>
                sqSum + ErrorFunctions.MSE(testCase.expected[outputIndex], output),
            0
        ) / testCase.expected.length;
    }

    getNetworkStatus(trainingData: testData): NetworkLog {
        this.run(trainingData.inputs);
        const log: NetworkLog = {
            layers: [],
            epochs: this.epochsTrained,
            generalError: getMeanNetworkError(this, this.trainingCases),
            error: this.getError(trainingData),
            output: this.getOutputLayerValues(),
        };

        this.layers.forEach((layer, layerIndex) => {
            const layerLog: LayerLog = {
                layerIndex: layerIndex,
                neurons: [],
            };
            layer.getNeurons().forEach((neuron, neuronIndex) => {
                const connectionsWeights: ConnectionLog[] = neuron.getConnections().map(
                    (conn) =>
                        ({
                            weight: roundWithPrecision(conn.weight, 6),
                            state: conn.inputNeuron.getState(),
                        })
                );

                const neuronLog: NeuronLog = {
                    index: neuronIndex,
                    state: neuron.getState(),
                    bias: neuron.getBias(),
                    incomingConnections: connectionsWeights,
                    inputsWeightedSum: neuron.getInputsWeightedSum(),
                    output: (ActivationFunctions[neuron.getActivationFunctionName()])(neuron.getInputsWeightedSum()),
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

    public getEpochsTrained(): number {
        return this.epochsTrained;
    }

    public dumpNetworkToSchema(): string {
        const network = {
            inputLayer: this.getInputLayer(),
            hiddenLayers: this.getHiddenLayers(),
            outputLayer:  this.getOutputLayer(),
            epochsTrained: this.epochsTrained,
            trainingCases: this.trainingCases,
        };
        return JSON.stringify(network);
    }

    private addLayer(layer: Layer): void {
        this.layers.push(layer);
    }

    private drawTestDataToWork(): void {
        this.chosenTrainingSet = getRandomElement(this.trainingCases);
    }

    public setTestDataToWork(testSetIndex: number): void {
        this.chosenTrainingSet = this.trainingCases[testSetIndex];
    }

    private getInputLayer(): Layer {
        return this.layers[0];
    }

    private getHiddenLayers(): Layer[] {
        return this.layers.slice(1, this.layers.length - 1);
    }

    private getOutputLayer(): Layer {
        return this.layers[this.layers.length - 1];
    }

    private getWorkingLayers(): WorkingLayers {
        return this.layers.slice(1, this.layers.length);
    }

    private getLayers(): Layer[] {
        return this.layers;
    }

    private setInputLayerValues(inputData: number[]): void {
        this.getInputLayer().setNeuronsValues(inputData);
    }
}
