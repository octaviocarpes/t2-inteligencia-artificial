import {Chromosome} from "./Chromosome";
import { Directions } from './constants/Directions'
import {Agent} from "./Agent";
import { Maze } from "./Maze";

interface Population {
  chromosome: Chromosome,
  fitnessScore: number
}

export class GeneticAlgorithm {
  public populationSize: number
  public generations: number
  public population: Array<Population>
  public movesPerPopulation: number
  public solution: Chromosome
  private agent: Agent
  private maze: Maze

  constructor(populationSize: number, generations: number, movesPerPopulation: number) {
    this.populationSize = populationSize
    this.generations = generations
    this.population = []
    this.solution = new Chromosome([])
    this.movesPerPopulation = movesPerPopulation
    this.maze = new Maze()
    this.agent = new Agent(this.maze)
  }

  private getRandomDirection(): string {
    const random = Math.random()
    if (random <= 0.25) {
      return Directions.UP
    } else if (random > 0.25 && random <= 0.50) {
      return Directions.DOWN
    } else if (random > 0.50 && random <= 0.75) {
      return Directions.LEFT
    } else if (random > 0.75) {
      return Directions.RIGHT
    }
  }

  private createPopulation(): Chromosome {
    let population = [];
    for(let i = 0; i < this.movesPerPopulation; i++) {
      population.push(this.getRandomDirection())
    }

    return new Chromosome(population)
  }

  public generateInitialPopulation(): void {
    for(let i = 0; i < this.populationSize; i++) {
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
    const populationIndex = Math.floor(Math.random() * this.populationSize)
    const chromosomeIndex = Math.floor(Math.random() * this.movesPerPopulation)
    const newDirection = this.getRandomDirection()
    this.population[populationIndex].chromosome.updateSolution(chromosomeIndex, newDirection)
  }

  public start(): void {
    console.log('\n')
    console.log('===================================')
    console.log('\n')
    let count = 0;
    this.generateInitialPopulation()

    while (count < this.generations) {
      console.log(this.population[count])

      // calculo aptidao
      for(let i = 0; i < this.populationSize; i++) {
        if (this.population[i].fitnessScore >= 100) {
          console.log('Found solution')
          count = this.generations
          break
        }
        const score = this.agent.walk(this.population[i].chromosome.getSolution())
        console.log(score)
        this.population[i].fitnessScore = score
        console.log(this.population[i])
      }
      // selecao
      const newPopulation = this.selectPopulation()
      // reproducao
      this.reproduce(newPopulation)
      // mutacao
      this.mutate()
      count++
    }
  }
}
