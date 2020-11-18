import { Maze } from './Maze'
import { GeneticAlgorithm } from "./GeneticAlgorithm";

const maze = new Maze()
const genetic = new GeneticAlgorithm(10, 10, 10)

console.log(maze.maze)
genetic.start()
