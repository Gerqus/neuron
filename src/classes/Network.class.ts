import { Layer } from './Layer.class';
import { NeuronSchema } from './Neuron.class';
import { LinkingFunctionSchema } from './LinkingFunction.class';
import { getRandomElement } from '../utils';

export interface NetworkSchema {
    inputLayer: NeuronSchema[];
    hiddenLayers?: NeuronSchema[][];
    outputLayer:  NeuronSchema[];
}
export type WorkingLayers = Layer[];

export class Network {
    private layers: Layer[] = [];
    private chosenTrainingSet: testData;
    private trainingCases: testData[];

    constructor(schema: NetworkSchema) {
        if (!schema.inputLayer || !schema.outputLayer) {
            throw new Error('Network must have input and output layers. Terminating...');
        }

        this.addLayer(new Layer(schema.inputLayer));
        if (schema.hiddenLayers) {
            schema.hiddenLayers.forEach((layerSchema) => {
                this.addLayer(new Layer(layerSchema));
            });
        }
        this.addLayer(new Layer(schema.outputLayer));
    }

    public interlinkNeurons(linkingFunction?: LinkingFunctionSchema): void {
        if (linkingFunction) {
            linkingFunction(this.getWorkingLayers());
        } else {
            this.getWorkingLayers().forEach(
                (currentLayer, previousLayerIndex) => { // previousLayerIndex: hidden layers ommit input layer, indexes are shifted by one
                    const previousLayer = this.layers[previousLayerIndex];
                    currentLayer.neurons.forEach((currentNeuron) => {
                        previousLayer.getNeurons().forEach((inputNeuron) => {
                            currentNeuron.connect(inputNeuron, Math.random());
                        });
                    });
                }
            );
        }
    }

    public setTrainingCases(trainingCases: testData[]): void {
        let errorFound = false;
        trainingCases.forEach((testCase, testCaseIndex) => {
            if (testCase.inputs.length !== this.getInputLayer().neurons.length) {
                console.error(`Expected network inputs for test case #${testCaseIndex} count doesn\'t match input neurons count (${testCase.expected.length} !== ${this.getOutputLayer().neurons.length}). Terminating...`);
                errorFound = true;
            }
            if (testCase.expected.length !== this.getOutputLayer().neurons.length) {
                console.error(`Expected network outputs for test case #${testCaseIndex} count doesn\'t match output neurons count (${testCase.expected.length} !== ${this.getOutputLayer().neurons.length}). Terminating...`);
                errorFound = true;
            }
        });

        if (errorFound) {
            throw new Error('Data model doesn\'t match network topology! Terminating...');
        }


        this.trainingCases = trainingCases;
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
            outputNeuron.increaseConnectionsErrorsSum(this.chosenTrainingSet.expected[neuronIndex] - outputNeuron.state);
        });

        this.getWorkingLayers()
            .reverse() // will work from end, since it's BACKpropagation
            .forEach((currentLayer, layerIndex) => {
                currentLayer.getNeurons().forEach((neuron) => {
                    neuron.calculateDelta();
                    neuron.connections.forEach(connection => {
                        connection.inputNeuron.increaseConnectionsErrorsSum(connection.weight * neuron.getDelta());
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
        return this.getOutputLayer().getNeurons().map(neuron => neuron.state);
    }

    public getError(testCase: testData): number {
        this.run(testCase.inputs);
        return this.getOutputLayerValues().reduce(
            (sqSum, output, outputIndex) =>
                sqSum + ((output - testCase.expected[outputIndex]) ** 2),
            0
        ) / testCase.expected.length;
    }

    // Debug only
    getLayersStatus(label: string): string[] {
        const log: any[] = [];
        log.push(`\n\n=== ${label}: ===`);
        this.layers.forEach((layer, layerIndex) => {
            log.push(`\n  Layer ${layerIndex}:`);
            layer.getNeurons().forEach((neuron, neuronIndex) => {
                const connectionsWeights = neuron.connections.map(
                    (conn) =>
                        `[weight: ${Math.round(conn.weight * 1_000_000) / 1_000_000}, state: ${conn.inputNeuron.state}]`
                );
                log.push(`   Neuron ${neuronIndex}:`);
                log.push(`    state:${neuron.state}`);
                log.push(`    bias:${neuron.getBias()}`);
                log.push(`    incoming connections:`);
            connectionsWeights.forEach((weight, i) =>
                log.push((`     conn#${i}: ${weight}`))
            );
                log.push(`    inputsWeightedSum:${neuron.getInputsWeightedSum()}`);
                log.push(`    output:${neuron.activationFunction(neuron.getInputsWeightedSum())}`);
                log.push(`    connectionsErrorsSum:${neuron.getConnectionsErrorsSum()}`);
                log.push(`    activationDerivativeCalculation:${neuron.getDelta() / neuron.getConnectionsErrorsSum()}`);
                log.push(`    delta:${neuron.getDelta()}`);
            });
        });
        return log;
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

    private getOutputLayer(): Layer {
        return this.layers[this.layers.length - 1];
    }

    private getWorkingLayers(): WorkingLayers {
        return this.layers.slice(1, this.layers.length);
    }

    private setInputLayerValues(inputData: number[]): void {
        this.getInputLayer().setNeuronsValues(inputData);
    }
}
