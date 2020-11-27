import { Neuron } from "./Neuron";

export class Network {
  private hiddenNeuronLayer: Array<Neuron>
  private resultNeuronLayer: Array<Neuron>
  private results: Array<number>

  constructor(
    public hiddenNeuronsSize: number,
    public resultNeuronsSize: number,
  ) {
    this.hiddenNeuronLayer = []
    this.resultNeuronLayer = []
    this.results = []
  }

  public setNetworkWeights(entrySize: number, weights: Array<number>): void {
    let k = 0;
    let temp: number[] = []

    for (let i = 0; i < this.hiddenNeuronsSize; i++) {
      for (let j = 0; j < entrySize; j++) {
        temp[j] = weights[k]
        k++
      }
      this.hiddenNeuronLayer.push(new Neuron(temp))
    }

    for (let i = 0; i < this.resultNeuronsSize; i++) {
      for (let j = 0; j < entrySize; j++) {
        temp[j] = weights[k]
        k++
      }
      this.resultNeuronLayer.push(new Neuron(temp))
    }
  }

  public propagation(x: number[]): number[] {

    let hiddenLayerResults: number[] = []

    for (let i = 0; i < this.hiddenNeuronsSize; i++) {
      hiddenLayerResults.push(this.hiddenNeuronLayer[i].calculateY(x))
    }

    for (let i = 0; i < this.resultNeuronsSize; i++) {
      this.results.push(this.resultNeuronLayer[i].calculateY(hiddenLayerResults))
    }

    return this.results
  }
}