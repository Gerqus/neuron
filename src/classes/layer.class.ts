import { Neuron } from "./neuron.class";

export class Layer {
    private neurons: Neuron[];

    constructor(layerSchema: Neuron[]) {
        this.neurons = layerSchema;
    }

    getNeurons(): Neuron[] {
        return this.neurons;
    }
}
