import { Layer } from "./layer.class";
import { Neuron } from "./neuron.class";

export class Network {
    private layers: Layer[];

    constructor(schema: Neuron[][]) {
        schema.forEach(layerSchema => {
            this.addLayer(new Layer(layerSchema));
        })
    }

    private addLayer(layer: Layer): void {
        this.layers.push(layer);
    }

    logLayersStatus(label: string) {
        console.log(`=== ${label}: ===`);
        this.layers.forEach((layer, layerIndex) => {
            console.log(`-- Layer ${layerIndex}:`);
            layer.getNeurons().forEach((neuron, neuronIndex) => {
                const connectionsWeights = neuron.connections.map((conn) => Math.round(conn.weight * 1_000_000) / 1_000_000);
                console.log(`- Neuron ${neuronIndex} state:${neuron.state} connections:${connectionsWeights.toString()} sum:${neuron.getInputsWeightedSum()} output:${neuron.activationFunction(neuron.getInputsWeightedSum())}`);
            });
        })
    }
}