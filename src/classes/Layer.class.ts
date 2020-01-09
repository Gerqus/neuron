import { Neuron, NeuronSchema } from './Neuron.class';

export class Layer {
    /*private*/ neurons: Neuron[] = [];

    constructor(layerSchema: NeuronSchema[], layerIndex: number) {
        this.neurons = layerSchema.map(neuronSchema => new Neuron(neuronSchema, {layerIndex, neuronIndex: this.neurons.length }));
    }

    public getNeurons(): Neuron[] {
        return this.neurons;
    }

    public setNeuronsValues(inputNeuronValues: number[]): void {
        if (this.getNeuronsCount() !== inputNeuronValues.length) {
            throw new Error('Input data points count doesn\'t match input neurons count. Terminating...');
        }
        this.neurons.forEach((neuron, neuronIndex) => neuron.setState(inputNeuronValues[neuronIndex]));
    }

    public getNeuronsCount(): number {
        return this.neurons.length;
    }

    public activateNeurons(): void {
        this.neurons.forEach(neuron => neuron.activate());
    }
}
