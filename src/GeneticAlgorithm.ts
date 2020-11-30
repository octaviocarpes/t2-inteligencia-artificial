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
    const wasWallHit = path.filter((walkResult) => walkResult.isValid.result === false && walkResult.isValid.reason.split(':')[0] === 'wall')
    if (wasWallHit) {
      return 100
    }
    return 0
  }

  private handleCycleDetection(path: WalkResult[]): number {
    const wasWallHit = path.filter((walkResult) => walkResult.isValid.result === false && walkResult.isValid.reason.split(':')[0] === 'wall')
    if (wasWallHit) {
      return 100
    }
    return 0
  }

  private handleCoinCollection(agent: Agent, coinsCollected: number) {
    const {x, y} = agent.currentPosition
    console.log(x, y)
    if (agent.isPositionACoin(x, y)) {
      agent.collectCoin(x, y)
      coinsCollected++
    }
  }


  private handleAgentWalk(direction: string) {
    let coinsCollected = 0
    let distanceTravelled = 0
    let path: WalkResult[] = []
    const maze = new Maze()
    const agent = new Agent(maze)
    const walkResult = agent.walk(direction)

    if (walkResult.isValid.result) {
      path.push(walkResult)
      distanceTravelled++
      this.handleCoinCollection(agent, coinsCollected)
    }
    const score = this.calculateFitness(coinsCollected, distanceTravelled, path)

    console.log(walkResult)
    console.log(score)
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

    switch (nextMove) {
      case 0: {
        this.handleAgentWalk(Directions.LEFT)
        break
      }

      case 1: {
        this.handleAgentWalk(Directions.UP)
        break
      }

      case 2: {
        this.handleAgentWalk(Directions.RIGHT)
        break
      }

      case 3: {
        this.handleAgentWalk(Directions.DOWN)
        break
      }

      default: return
    }
  }
}
