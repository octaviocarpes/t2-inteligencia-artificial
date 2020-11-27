import { Chromosome } from "./Chromosome";

interface Population {
  chromosome: Chromosome,
  fitnessScore: number
}

export class GeneticAlgorithm {
  public populationSize: number
  public generations: number
  public population: Array<Population>
  public solution: Chromosome
  public networkSize: number

  constructor(populationSize: number, generations: number, networkSize: number) {
    this.populationSize = populationSize
    this.generations = generations
    this.population = []
    this.solution = new Chromosome([])
    this.networkSize = networkSize
  }

  private createPopulation(): Chromosome {
    let population = [];
    for (let i = 0; i < this.networkSize; i++) {
      const rng = Math.random()
      if (rng < 0.5) population.push((Math.random() * -1))
      else population.push(Math.random())
    }

    return new Chromosome(population)
  }

  public generateInitialPopulation(): void {
    for (let i = 0; i < this.populationSize; i++) {
      this.population.push({
        chromosome: this.createPopulation(),
        fitnessScore: 0
      })
    }
  }

  private calculateFitness(population: Population) {

  }

  private selectPopulation(): Population {
    return this.population[0]
  }

  private reproduce(population: Population) {

  }

  private mutate(): void {

  }

  public start(): void {
    console.log('\n')
    console.log('===================================')
    console.log('\n')
    let count = 0;
    this.generateInitialPopulation()

    console.log(this.population)
  }
}
