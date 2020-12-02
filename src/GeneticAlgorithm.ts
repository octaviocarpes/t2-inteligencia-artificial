/*

  Tirar duvida: ficar propagando entorno do agente na rede ate o agente errar?

  A principio ficar propagando entorno do agente ate ele errar
    quando ele errar, fazer:
      ver quantas moedas ele pegou
      ver qual a distancia total percorrida pelo agente
      calcular o fitness do cromossomo
      recomecar o processo com o proximo cromossomo

  Depois de terminar todos os cromossomos
    escolher o de maior fitness e criar a nova populacao (algoritmo genetico com reproducao e mutacao)

*/


import {Agent, WalkResult} from "./Agent";
import { Chromosome } from "./Chromosome";
import { Directions } from "./constants/Directions";
import { Maze } from "./Maze";
import { Network } from "./Network";
import {findDuplicate} from "./utils/FindDuplicate";
const Jetty = require('jetty')

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
    for (let i = 0; i < this.populationSize; i++) {
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

  private calculateFitness(coinsCollected: number, distanceTravelled: number, path: WalkResult[]) {
    return coinsCollected * 100 + distanceTravelled * 5 - this.handleCycleDetection(path) - this.penalizeByWallHit(path)
  }

  private selectPopulation(): Population {
    const bestFittedPopulationIndex = this.population.indexOf(
      this.population.filter(
        element => element.fitnessScore === this.population
          .map(being => being.fitnessScore)
          .reduce((prev, next) => {
            if (prev > next) return prev
            else return next
          }))[0]
    )

    const bestFittedPopulation: Population = {
      chromosome: this.population[bestFittedPopulationIndex].chromosome,
      fitnessScore: 0
    }

    this.population[bestFittedPopulationIndex] = {
      chromosome: new Chromosome([]),
      fitnessScore: 0
    }
    return bestFittedPopulation
  }

  private mediumCrossOver(father: Population, mother: Population): Population {

    let childArray = []

    for(let i = 0; i < father.chromosome.getSolution().length; i++) {
      const mediumPoint = (father.chromosome.getSolution()[i] * mother.chromosome.getSolution()[i]) / 2
      childArray.push(mediumPoint)
    }

    return {
      chromosome: new Chromosome(childArray),
      fitnessScore: 0
    }
  }

  private reproduce(population: Population) {
    let newPopulation: Population[] = []

    newPopulation.push(population)

    const father = population
    const mother = this.selectPopulation()
    newPopulation.push(mother)

    const child = this.mediumCrossOver(father, mother)
    newPopulation.push(child)

    for (let i = 0; i < this.populationSize - 3; i++) {
      if (i % 2 === 0) {
        newPopulation.push(this.mediumCrossOver(father, newPopulation[i]))
      } else newPopulation.push(this.mediumCrossOver(mother, newPopulation[i]))
    }

    this.population = [...newPopulation]
  }

  private mutateChromossome(chromosome: Population): void {
    const rng = Math.random()

    for (let i = 0; i < chromosome.chromosome.getSolution().length; i++) {
      if (rng < 0.1) {
        chromosome.chromosome.getSolution()[i] = Math.random()
      }
    }
  }

  private mutate(): void {
    for(let i = 0; i < this.populationSize; i++) {
      const rng = Math.random()
      if (rng < 0.2) this.mutateChromossome(this.population[i])
    }
  }

  private penalizeByWallHit(path: WalkResult[]): number {
    const wasWallHit = path.filter((walkResult) => walkResult.isValid.result === false)
    if (wasWallHit.length) {
      return 100
    }
    return 0
  }

  private handleCycleDetection(path: WalkResult[]): number {
    if (path.length) {
      const haveDuplicates = findDuplicate(path)

      if (haveDuplicates.length) {
        return 100
      }
    }

    return 0
  }

  private handleCoinCollection(agent: Agent, coinsCollected: number) {
    const {x, y} = agent.currentPosition
    if (agent.isPositionACoin(x, y)) {
      agent.collectCoin(x, y)
      coinsCollected++
    }
  }


  private handleAgentWalk(agent: Agent, direction: string) {
    let coinsCollected = 0
    let distanceTravelled = 0
    let path: WalkResult[] = []
    const walkResult = agent.walk(direction)

    if (walkResult.isValid.result) {
      path.push(walkResult)
      distanceTravelled++
      this.handleCoinCollection(agent, coinsCollected)
    }
    const score = this.calculateFitness(coinsCollected, distanceTravelled, path)

    return {
      walkResult,
      score
    }
  }

  public start(): void {
    let finalDestination = false
    let path = []
    let bestPath = []
    this.generateInitialPopulation()

    let generationCount = 0;
    while (generationCount < this.generations) { // generationCount
      let populationCount = 0;
      while (populationCount  < this.populationSize) { // populationCount
        let iterationResult = true
        let lastWalkPosition
        let cycleDetected
        let isPositionValid
        let walkResult
        let score = 0
        const maze = new Maze()
        const agent = new Agent(maze)
        let chromossome = this.population[populationCount].chromosome.getSolution()
        const network = new Network(8, 4)
        let agentSurrounding = agent.getAgentSurroundings().map(surrounding => surrounding.value)
        network.setNetworkWeights(8, chromossome)

        while (iterationResult) {
          let propagationResult = network.propagation(agentSurrounding)

          const nextMove = propagationResult.indexOf(
            propagationResult.reduce((prev, next): number => {
              if (prev > next) return prev
              else return next
            })
          )

          switch (nextMove) {
            case 0: {
              walkResult = this.handleAgentWalk(agent, Directions.LEFT)
              iterationResult = walkResult.walkResult.isValid.result
              agentSurrounding = walkResult.walkResult.agentSurroundings.map(surrounding => surrounding.value * surrounding.distance)
              break
            }

            case 1: {
              walkResult = this.handleAgentWalk(agent, Directions.UP)
              iterationResult = walkResult.walkResult.isValid.result
              agentSurrounding = walkResult.walkResult.agentSurroundings.map(surrounding => surrounding.value * surrounding.distance)
              break
            }

            case 2: {
              walkResult = this.handleAgentWalk(agent, Directions.RIGHT)
              iterationResult = walkResult.walkResult.isValid.result
              agentSurrounding = walkResult.walkResult.agentSurroundings.map(surrounding => surrounding.value * surrounding.distance)
              break
            }

            case 3: {
              walkResult = this.handleAgentWalk(agent, Directions.DOWN)
              iterationResult = walkResult.walkResult.isValid.result
              agentSurrounding = walkResult.walkResult.agentSurroundings.map(surrounding => surrounding.value * surrounding.distance)
              finalDestination = walkResult.walkResult.isFinalDestination
              break
            }

            default: break
          }
          score += walkResult.score
          isPositionValid = walkResult.walkResult.isValid.result

          lastWalkPosition = `${walkResult.walkResult.position.x} - ${walkResult.walkResult.position.y}`

          if (isPositionValid) {
            if (path.filter(element => element === lastWalkPosition).length === 0) {
              path.push(lastWalkPosition)
            } else {
              cycleDetected = true
              iterationResult = false
            }
          } else {
            iterationResult = false
          }

          if (finalDestination) {
            iterationResult = false
          }
        }
        console.log('\n')
        console.log('**********************************************************')
        console.log(`Population: ${populationCount}`)
        console.log(`Path: ${path.map(element => element += ' ')}`)
        console.log(`Is Path Valid:
        value: ${isPositionValid},
        reason: ${cycleDetected ? 'Cycle Detected' : 'Position is invalid'}: (${lastWalkPosition})
        `)
        console.log('\n')
        console.log(`Score: ${score}`)
        console.log('**********************************************************')
        console.log('\n')

        this.population[populationCount].fitnessScore = score

        if (bestPath.length < path.length) {
          bestPath = path
        }

        populationCount++
      }

      if (finalDestination) {
        console.log('Final destination found, stopping genetic cycle')
        console.log(path)
      }

      console.log(`Generation: ${generationCount}`)
      console.log(`Reproducing and mutating population...`)

      const bestPopulation = this.selectPopulation()
      // reproduce
      this.reproduce(bestPopulation)
      // mutate
      this.mutate()

      generationCount++
    }

    console.log(`Best path found: ${bestPath}`)
  }
}
