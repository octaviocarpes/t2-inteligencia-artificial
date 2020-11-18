export class Chromosome {
  constructor(private solution: string[]) {
  }

  public getSolution(): string[] {
    return this.solution
  }

  public updateSolution(index: number, value: string) {
    this.solution[index] = value
  }
}
