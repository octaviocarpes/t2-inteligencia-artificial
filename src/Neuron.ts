export class Neuron {
  private defineFunction: number;
  public weights: number[];

  constructor(weights: number[]) {
    this.defineFunction = 0;
    this.weights = weights;
  }

  public setFunction(defineFunction: number): void {
    this.defineFunction = defineFunction;
  }

  public calculateY(x: number[]): number {
    let v: number = 0;
    let i;

    for (i = 0; i < x.length; i++) {
      v = v + this.weights[i] * x[i];
    }

    console.log(this.weights[i]);
    v = v + this.weights[i]; // bias

    if (this.defineFunction === 1) {
      return this.hyperbolicTangent(v);
    } else {
      return this.logistic(v);
    }
  }

  public logistic(v: number): number {
    return 1 / (1 + Math.exp(-v));
  }

  public hyperbolicTangent(v: number): number {
    return Math.tanh(v);
  }
}
