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
    return coinsCollected * 10 + distanceTravelled * 3 - this.handleCycleDetection(path) - this.penalizeByWallHit(path)
  }

  private selectPopulation(): Population {
    return this.population[0]
  }

  private reproduce(population: Population) {

  }

  private mutate(): void {

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

  private getFirstResult() {

  }

  public start(): void {
    this.generateInitialPopulation()

    let count = 0;
    let iterationResult
    const maze = new Maze()
    const agent = new Agent(maze)
    let chromossome = this.population[count].chromosome.getSolution()
    const network = new Network(8, 4)
    network.setNetworkWeights(8, chromossome)

    // -1 fora do labirinto
    // 0 parede
    // 1 caminho livre
    // 2 moeda
    const agentSurrounding = agent.getAgentSurroundings().map(surrounding => surrounding.value)
    const propagationResult = network.propagation(agentSurrounding)

    const nextMove = propagationResult.indexOf(
      propagationResult.reduce((prev, next): number => {
        if (prev > next) return prev
        else return next
      })
    )


    switch (nextMove) {
      case 0: {
        iterationResult = this.handleAgentWalk(agent, Directions.LEFT)
        break
      }

      case 1: {
        iterationResult = this.handleAgentWalk(agent, Directions.UP)
        break
      }

      case 2: {
        iterationResult = this.handleAgentWalk(agent, Directions.RIGHT)
        break
      }

      case 3: {
        iterationResult = this.handleAgentWalk(agent, Directions.DOWN)
        break
      }

      default: return
    }
    console.log(iterationResult)

    // while (count < this.populationSize) {
    //  Fazer agente caminhar ate fracassar
    //  aqui algoritmo genetico
    //  depois do agente caminhar e fracassar, fazer os esquemas do genetico
    // }
    count++
  }
}
