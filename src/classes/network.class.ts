import { Layer } from "./layer.class";
import { Neuron } from "./neuron.class";

export class Network {
    private layers: Layer[] = [];
    private inputData: dataset;

    constructor(schema: Neuron[][]) {
        if (schema.length < 2) {
            throw new Error('Network must consist of at least 2 layers. Terminating...');
        }

        schema.forEach(layerSchema => {
            this.addLayer(new Layer(layerSchema));
        })
    }

    public interlinkNeurons(): void {
        this.getWorkingLayers().forEach((currentLayer, previousLayerIndex) => { // previousLayerIndex: since hidden layers ommit input layer, indexes are shifted by one
            const previousLayer = this.layers[previousLayerIndex];
            currentLayer.interlinkNeurons(previousLayer);
        });
    }

    public setDataToWork(inputData: dataset): void {
        if(!inputData || !inputData.length) {
            throw new Error('Test suite data has wrong format. Terminating...');
        }
        this.inputData = inputData;
    }
    
    public run(): void {
        this.setInputLayerValues(this.inputData);
    
        this.getWorkingLayers().forEach(layer => {
            layer.activateNeurons();
        });
    }

    public logNetworkOutput(runLabel?: string):void {
        console.log(`Output from last run (${runLabel}):`);
        this.readOutputLayerValues().forEach(
            (neuronState, index) => console.log(`Neuron#${index}: ${neuronState}`)
        );
    }

    public backpropagateError(expectedOutput: dataset): void {
        this.layers.forEach(layer => {
            layer.getNeurons().forEach(neuron => {
                neuron.clearErrorRates();
            })
        })

        this.getOutputLayer().getNeurons().forEach((outputNeuron, neuronIndex) => {
            outputNeuron.increaseConnectionsErrorsSum(expectedOutput[neuronIndex] - outputNeuron.state);
        });

        this.getWorkingLayers()
            .reverse() // will work from ens, since it's BACKpropagation
            .slice(0, this.layers.length - 2) // won't work on hidden layer, so we won't propate error from it to input layer
            .forEach((currentLayer, layerNumber) => {
                currentLayer.getNeurons().forEach((neuron, neuronNumber) => {
                    neuron.calculateDelta();
                    neuron.connections.forEach(connection => {
                        connection.inputNeuron.increaseConnectionsErrorsSum(connection.weight * neuron.getDelta());
                    });
                })
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

    private getInputLayer(): Layer {
        return this.layers[0];
    }

    private getOutputLayer(): Layer {
        return this.layers[this.layers.length - 1];
    }

    private getWorkingLayers(): Layer[] {
        return this.layers.slice(1, this.layers.length);
    }

    private setInputLayerValues(inputData: number[]): void {
        this.getInputLayer().setNeuronsValues(inputData);
    }

    private readOutputLayerValues(): number[] {
        return this.getOutputLayer().getNeurons().map(neuron => neuron.state);
    }

    logLayersStatus(label: string): void {
        console.log(`=== ${label}: ===`);
        this.layers.forEach((layer, layerIndex) => {
            console.log(`-- Layer ${layerIndex}:`);
            layer.getNeurons().forEach((neuron, neuronIndex) => {
                const connectionsWeights = neuron.connections.map((conn) => `[${Math.round(conn.weight * 1_000_000) / 1_000_000}, ${0.1 * neuron.getDelta() * conn.inputNeuron.state}]`);
                console.log(`- Neuron ${neuronIndex} state:${neuron.state} connections:${connectionsWeights} sum:${neuron.getInputsWeightedSum()} output:${neuron.activationFunction(neuron.getInputsWeightedSum())} connectionsErrorsSum:${neuron.connectionsErrorsSum} activationDerivativeCalculation:${neuron.activationDerivativeCalculation()} delta:${neuron.getDelta()} bias:${neuron.bias}`);
            });
        })
    }

    private addLayer(layer: Layer): void {
        this.layers.push(layer);
    }
}