import { Agent } from "./Agent";
import { Chromosome } from "./Chromosome";
import { Directions } from "./constants/Directions";
import { Maze } from "./Maze";
import { Network } from "./Network";

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

  private makeAgentWalk(direction: string) {
    const maze = new Maze()
    const agent = new Agent(maze)
    const walkResult = agent.walk(direction)
    return walkResult
  }

  public start(): void {
    let count = 0;

    let chromossome = [];
    for (let i = 0; i < this.populationSize; i++) {
      const rng = Math.random()
      if (rng < 0.5) chromossome.push((Math.random() * -1))
      else chromossome.push(Math.random())
    }

    const network = new Network(8, 4)

    network.setNetworkWeights(8, chromossome)


    // -1 fora do labirinto
    // 0 parede
    // 1 caminho livre
    // 2 moeda
    const propagationResult = network.propagation([-1, -1, 1, 1]) // a gente tem que pegar o entorno do agente e passar pra ca

    const nextMove = propagationResult.indexOf(
      propagationResult.reduce((prev, next): number => {
        if (prev > next) return prev
        else return next
      })
    )

    // tracking da distancia que o agente percorreu
    // tracking de quantas moedas
    // para calcular o fitness do cromossomo

    switch (nextMove) {
      case 0: {
        console.log(this.makeAgentWalk(Directions.LEFT))
        break
      }

      case 1: {
        console.log(this.makeAgentWalk(Directions.UP))
        break
      }

      case 2: {
        console.log(this.makeAgentWalk(Directions.RIGHT))
        break
      }

      case 3: {
        console.log(this.makeAgentWalk(Directions.DOWN))
        break
      }

      default: return
    }
  }
}
