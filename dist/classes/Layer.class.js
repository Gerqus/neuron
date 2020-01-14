"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Neuron_class_1 = require("./Neuron.class");
class Layer {
    constructor(layerSchema) {
        this.neurons = [];
        this.neurons = layerSchema.neurons.map(neuronSchema => new Neuron_class_1.Neuron(neuronSchema));
    }
    getNeurons() {
        return this.neurons;
    }
    setNeuronsValues(inputNeuronValues) {
        if (this.getNeuronsCount() !== inputNeuronValues.length) {
            throw new Error('Input data points count doesn\'t match input neurons count. Terminating...');
        }
        this.neurons.forEach((neuron, neuronIndex) => neuron.setState(inputNeuronValues[neuronIndex]));
    }
    getNeuronsCount() {
        return this.neurons.length;
    }
    activateNeurons() {
        this.neurons.forEach(neuron => neuron.activate());
    }
    saveLayerToSchema() {
        return {
            neurons: this.neurons.map(neuron => neuron.saveNauronToSchema()),
        };
    }
}
exports.Layer = Layer;
//# sourceMappingURL=Layer.class.js.map