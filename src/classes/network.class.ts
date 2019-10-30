import { Layer } from "./layer.class";
import { Neuron } from "./neuron.class";
import { Connection } from "./connection.class";

export class Network {
    private layers: Layer[] = [];
    private connections: Connection[];
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

    public learn(expectedOutput: dataset): void {
        this.getOutputLayer().getNeurons().forEach((outputNeuron, neuronIndex) => {
            outputNeuron.setNeuronError(
                (expectedOutput[neuronIndex] - outputNeuron.state) * outputNeuron.activationDerivativeCalculation()
            );
        });
        this.logLayersStatus("after output layer error calculation");

        this.getWorkingLayers().reverse().forEach((currentLayer, layerNumber) => {
            currentLayer.getNeurons().forEach(neuron => {
                neuron.incomingConnections.forEach(connection => {
                    connection.neuron.setNeuronError(connection.neuron.getNeuronError() + connection.weight * neuron.getNeuronError());
                });
            })
            this.logLayersStatus(`after layer #${layerNumber}`);
        });
    }

    private getInputLayer(): Layer {
        return this.layers[0];
    }

    private getOutputLayer(): Layer {
        return this.layers[this.layers.length - 1];
    }

    private getHiddenLayers(): Layer[] {
        if (this.layers.length < 3) {
            throw new Error('There are no hidden layers in this network. Panic! Terminating...');
        }
        return this.layers.slice(1, this.layers.length - 1);
    }

    private getWorkingLayers(): Layer[] {
        return this.layers.slice(1, this.layers.length);
    }

    private setInputLayerValues(inputData: number[]): void {
        this.getInputLayer().setNeuronsValues(inputData);
    }

    private readOutputLayerValues(): number[] {
        return this.getOutputLayer().getNeuronsValues();
    }

    logLayersStatus(label: string): void {
        console.log(`=== ${label}: ===`);
        this.layers.forEach((layer, layerIndex) => {
            console.log(`-- Layer ${layerIndex}:`);
            layer.getNeurons().forEach((neuron, neuronIndex) => {
                const connectionsWeights = neuron.incomingConnections.map((conn) => Math.round(conn.weight * 1_000_000) / 1_000_000);
                console.log(`- Neuron ${neuronIndex} state:${neuron.state} connections:${connectionsWeights.toString()} sum:${neuron.getInputsWeightedSum()} output:${neuron.activationFunction(neuron.getInputsWeightedSum())} error:${neuron.getNeuronError()}`);
            });
        })
    }

    private addLayer(layer: Layer): void {
        this.layers.push(layer);
    }
}