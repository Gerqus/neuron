import { Neuron } from "./neuron.class";
import { Connection } from "./connection.class";

export class Layer {
    private neurons: Neuron[];

    constructor(layerSchema: Neuron[]) {
        this.neurons = layerSchema;
    }

    public getNeurons(): Neuron[] {
        return this.neurons;
    }

    public interlinkNeurons(inputLayer: Layer): void {
        this.neurons.forEach((currentNeuron) => {
            inputLayer.getNeurons().forEach((inputNeuron) => {
                const connectionDraft: ConnectionDefinition = {
                    neuron: inputNeuron,
                    weight: Math.random(),
                };
                const newConnection = currentNeuron.setIncomingConnection(connectionDraft);
                inputNeuron.setOutgoingConnection(newConnection);
            });
        });
    }

    public 

    public setNeuronsValues(inputNeuronValues: number[]): void {
        if (this.getNeuronsCount() !== inputNeuronValues.length) {
            throw new Error('Input data points count doesn\'t match input neurons count. Terminating...');
        }
        this.neurons.forEach((neuron, neuronIndex) => neuron.state = inputNeuronValues[neuronIndex]);
    }

    public getNeuronsCount(): number {
        return this.neurons.length;
    }

    public activateNeurons(): void {
        this.neurons.forEach(neuron => neuron.activate());
    }

    // public getNeuronsErrorSum(): number {
    //     return this.neurons.reduce((sum, neuron) => sum + neuron.getNeuronError(), 0);
    // }

    public getNeuronsValues(): number[] {
        return this.neurons.map(neuron => neuron.state);
    }
}
