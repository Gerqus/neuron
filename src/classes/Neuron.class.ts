import { Connection, ConnectionSchema } from './Connection.class';
import { ActivationFunctionSchema, ActivationFunctions } from '../libs/activationFunctions';

export interface NeuronSchema {
  activationFunctionName: string;
  bias?: number;
  initialState?: number;
  learningFactor?: number;
  name?: string;
  incomingConnectionsSchemas?: ConnectionSchema[];
}

export class Neuron {
  private connections: Connection[] = [];
  private activationFunction: ActivationFunctionSchema;
  private state: number;
  private costsSum = 0;
  private delta = 0;
  private inputsSum = 0;
  private bias: number;
  private learningFactor: number;
  private derivativeCalcResult: number;
  private name: string;

  constructor(
    {
      bias = Math.random() * 0.5,
      initialState = 0,
      learningFactor = 0.1,
      name,
      activationFunctionName,
    }: NeuronSchema
  ) {
    console.log('Neuron initial state:', bias, initialState, learningFactor, name, activationFunctionName);

    this.activationFunction = ActivationFunctions[activationFunctionName];
    this.bias = bias;
    this.state = initialState;
    this.learningFactor = learningFactor;
    this.name = name;
  }

  connect(inputNeuron: Neuron, weight: number = 1): void {
    this.connections.push({
      inputNeuron,
      weight,
    });
  }

  public increaseCostsSum(error: number): void {
    this.costsSum += error;
  }

  public calculateDelta(): void {
    this.calculateActivationDerivative();
    this.delta = this.costsSum * this.derivativeCalcResult;
  }

  public getDelta() {
    return this.delta;
  }

  public clearErrorRates(): void {
    this.costsSum = 0;
  }

  private calculateActivationDerivative(): void {
    this.derivativeCalcResult = this.activationFunction.derivative(this.getInputsWeightedSum() + this.bias);
  }

  public updateConnectionsWeights(): void {
    this.connections.forEach(connection => {
      connection.weight += this.learningFactor * this.delta * connection.inputNeuron.state;
    });
  }

  public updateBias(): void {
    this.bias += 0.1 * this.delta;
  }

  public getInputsWeightedSum(): number {
    return this.connections.reduce(
      (sum, connection): number => sum += connection.inputNeuron.state * connection.weight,
      0
    );
  }

  public activate(): void {
    this.inputsSum = this.getInputsWeightedSum() + this.bias;
    this.state = this.activationFunction(this.inputsSum);
  }

  public getBias(): number {
    return this.bias;
  }

  public getCostsSum(): number {
    return this.costsSum;
  }

  public getName(): string {
    return this.name;
  }

  public getConnections(): Connection[] {
    return this.connections;
  }

  public getState(): number {
    return this.state;
  }

  public setState(state: number): void {
    this.state = state;
  }

  public getActivationFunctionName(): string {
    return this.activationFunction.name;
  }

  public getLearningFactor(): number {
    return this.learningFactor;
  }

  public saveNeuronToSchema(): NeuronSchema {
    return {
      activationFunctionName: this.activationFunction.toString(),
      bias: this.bias,
      learningFactor: this.learningFactor,
      name: this.name,
      incomingConnectionsSchemas: this.connections.map(conn => ({
        inputNeuronName: conn.inputNeuron.getName(),
        weight: conn.weight,
      })),
    };
  }
}
