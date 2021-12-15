import { Neuron, NeuronSchema } from './Neuron.class';
export interface LayerSchema {
    neurons: NeuronSchema[];
}
export declare class Layer {
    private neurons;
    constructor(layerSchema: LayerSchema);
    getNeurons(): Neuron[];
    setNeuronsValues(inputNeuronValues: number[]): void;
    getNeuronsCount(): number;
    activateNeurons(): void;
    saveLayerToSchema(): LayerSchema;
}
