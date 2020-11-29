"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneticAlgorithm = void 0;
const Agent_1 = require("./Agent");
const Chromosome_1 = require("./Chromosome");
const Directions_1 = require("./constants/Directions");
const Maze_1 = require("./Maze");
const Network_1 = require("./Network");
class GeneticAlgorithm {
    constructor(populationSize, generations, networkSize) {
        this.populationSize = populationSize;
        this.generations = generations;
        this.population = [];
        this.solution = new Chromosome_1.Chromosome([]);
        this.networkSize = networkSize;
    }
    createPopulation() {
        let population = [];
        for (let i = 0; i < this.networkSize; i++) {
            const rng = Math.random();
            if (rng < 0.5)
                population.push(Math.random() * -1);
            else
                population.push(Math.random());
        }
        return new Chromosome_1.Chromosome(population);
    }
    generateInitialPopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push({
                chromosome: this.createPopulation(),
                fitnessScore: 0
            });
        }
    }
    calculateFitness(population) { }
    selectPopulation() {
        return this.population[0];
    }
    reproduce(population) { }
    mutate() { }
    makeAgentWalk(direction, agent) {
        const walkResult = agent.walk(direction);
        return walkResult;
    }
    start() {
        let count = 0;
        let chromossome = [];
        for (let i = 0; i < this.populationSize; i++) {
            const rng = Math.random();
            if (rng < 0.5)
                chromossome.push(Math.random() * -1);
            else
                chromossome.push(Math.random());
        }
        const network = new Network_1.Network(8, 4);
        for (let index = 0; index < 1; index++) {
            const maze = new Maze_1.Maze(); // para cada cromosso cria um agente e passa insntacia um maze nele
            const agent = new Agent_1.Agent(maze);
            network.setNetworkWeights(8, chromossome);
            // -1 fora do labirinto
            // 0 parede
            // 1 caminho livre
            // 2 moeda
            const arraydenumero = agent.getAgentSurroundings();
            const valores = [];
             // devido a interface criada foi desmembrado e criado um array para nao modificar assinaturas de outros metodos
            for (let index = 0; index < arraydenumero.length; index++) {
                valores.push(arraydenumero[index].value);
                valores.push(arraydenumero[index].distance);
            }
            const propagationResult = network.propagation(valores); // a gente tem que pegar o entorno do agente e passar pra ca
            const nextMove = propagationResult.indexOf(propagationResult.reduce((prev, next) => {
                if (prev > next)
                    return prev;
                else
                    return next;
            }));
            const resultado = this.passoDado(nextMove, agent); // fazer a validação que ele
            // tracking da distancia que o agente percorreu
            // tracking de quantas moedas
            // para calcular o fitness do cromossomo
        }
    }
    passoDado(direction, agent) {
        switch (direction) {
            case 0: {
                //console.log(this.makeAgentWalk(Directions_1.Directions.LEFT, agent));
                break;
            }
            case 1: {
                //console.log(this.makeAgentWalk(Directions_1.Directions.UP, agent));
                break;
            }
            case 2: {
                //console.log(this.makeAgentWalk(Directions_1.Directions.RIGHT, agent));
                break;
            }
            case 3: {
                //console.log(this.makeAgentWalk(Directions_1.Directions.DOWN, agent));
                break;
            }
            default:
                return; // tirar o default
        }
    }
}
exports.GeneticAlgorithm = GeneticAlgorithm;
//# sourceMappingURL=GeneticAlgorithm.js.map