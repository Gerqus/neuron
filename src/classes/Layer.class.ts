import { Neuron, NeuronSchema } from './Neuron.class';

export interface LayerSchema {
    neurons: NeuronSchema[];
    name?: string;
}

export class Layer {
    private neurons: Neuron[] = [];
    private name: string;

    constructor(layerSchema: LayerSchema) {
      this.neurons = layerSchema.neurons.map((neuronSchema, index) => new Neuron(Object.assign({name: `${layerSchema.name}#${index}`}, neuronSchema)));
      this.name = layerSchema.name;
    }

    public getNeurons(): Neuron[] {
        return this.neurons;
    }

    public setNeuronsValues(inputNeuronValues: number[]): void {
        if (this.getNeuronsCount() !== inputNeuronValues.length) {
          console.log('On layer', this.name, 'with neurons', this.neurons, 'following data was input', inputNeuronValues);
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

    public saveLayerToSchema(): LayerSchema {
        return {
            neurons: this.neurons.map(neuron => neuron.saveNeuronToSchema()),
        };
    }
}
