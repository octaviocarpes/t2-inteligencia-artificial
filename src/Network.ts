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

    for (let i = 0; i < this.hiddenNeuronsSize; i++) {
      let temp: number[] = []
      for (let j = 0; j < entrySize + 1; j++) {
        temp.push(weights[k])
        k++
      }
      this.hiddenNeuronLayer.push(new Neuron(temp))
    }

    for (let i = 0; i < this.resultNeuronsSize; i++) {
      let temp: number[] = []
      for (let j = 0; j < entrySize + 1; j++) {
        temp.push(weights[k])
        k++
      }
      this.resultNeuronLayer.push(new Neuron(temp))
    }
  }

  public propagation(x: number[]): number[] {

    let hiddenLayerResults: number[] = []

    for (let i = 0; i < this.hiddenNeuronsSize; i++) {
      const synapse = this.hiddenNeuronLayer[i].calculateY(x)
      hiddenLayerResults.push(synapse)
    }

    for (let i = 0; i < this.resultNeuronsSize; i++) {
      const synapse = this.resultNeuronLayer[i].calculateY(x)
      this.results.push(synapse)
    }

    return this.results
  }
}
