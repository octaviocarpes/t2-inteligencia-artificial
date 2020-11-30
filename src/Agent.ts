import { Maze } from "./Maze"
import { Directions, MazeValues } from "./constants/Directions"
import { Neuron } from "./Neuron"

interface Position {
  x: number,
  y: number
}

interface AgentSurrouding {
  value: number
  distance: number
}

export interface WalkResult {
  position: Position
  isValid: {
    result: boolean
    reason?: string
  }
  agentSurroundings: AgentSurrouding[]
  distanceToEnd: number
}

export class Agent {
  private maze: Maze
  public currentPosition: Position

  constructor(maze: Maze) {
    this.maze = maze
    this.currentPosition = { x: 0, y: 0 }
  }

  private updatePosition(position: string) {
    switch (position) {
      case Directions.UP:
        this.currentPosition.y -= 1
        break

      case Directions.DOWN:
        this.currentPosition.y += 1
        break

      case Directions.LEFT:
        this.currentPosition.x -= 1
        break

      case Directions.RIGHT:
        this.currentPosition.x += 1
        break

      default: return
    }
  }

  private getInvalidPositionReason(): string {
    const { x, y } = this.currentPosition
    if (this.isPositionWall(x, y)) return 'wall: Agent hit a wall'
    else return 'bounds: Agent went out of bounds'
  }

  private isInsideMaze(x: number, y: number): boolean {
    if (x < 0 || x > 10 || y < 0 || y > 10) {
      return false
    }
    return true
  }

  private isPositionWall(x: number, y: number): boolean {
    if (this.isInsideMaze(x, y)) {
      const { maze } = this.maze
      if (maze[x][y] === '1') {
        return true
      }
      return false
    } return false
  }


  private calculateEuclideanDistance(x: number, y: number): number {
    let coordinate: number[] = [x, y]
    let dif_y: number = Math.abs(coordinate[1] - 12)
    let dif_x: number = Math.abs(coordinate[0] - 12)

    let distance: number = Math.sqrt((dif_y * dif_y) + (dif_x * dif_x))

    return distance
  }

  private isPositionValid(): boolean {
    const { x, y } = this.currentPosition
    return this.isInsideMaze(x, y) && !this.isPositionWall(x, y)
  }

  private getPositionValue(x: number, y: number): number {
    const { maze } = this.maze
    if (this.isInsideMaze(x, y)) {
      switch (maze[x][y]) {
        case '1':
          return 0 // Parede

        case '0':
          return 1 // Caminho livre

        case 'M':
          return 2 // Moeda

        case 'E':
          return 1

        case 'S':
          return 100

        default:
          return -1
      }
    } return -1 // Fora do labirinto
  }

  private createAgentSurrounding(x, y) {
    return {
      value: this.getPositionValue(x, y),
      distance: this.calculateEuclideanDistance(x, y)
    }
  }

  public getAgentSurroundings(): AgentSurrouding[] {
    const { x, y } = this.currentPosition
    const leftView = x - 1
    const rightView = x + 1
    const topView = y - 1
    const bottomView = y + 1

    const left: AgentSurrouding = this.createAgentSurrounding(leftView, y)
    const right: AgentSurrouding = this.createAgentSurrounding(rightView, y)
    const up: AgentSurrouding = this.createAgentSurrounding(x, topView)
    const down: AgentSurrouding = this.createAgentSurrounding(x, bottomView)

    return [left, up, right, down]
  }

  public walk(path: string): WalkResult {
    this.updatePosition(path)

    if (this.isPositionValid()) {
      return {
        position: this.currentPosition,
        isValid: {
          result: this.isPositionValid(),
        },
        agentSurroundings: this.getAgentSurroundings(),
        distanceToEnd: this.calculateEuclideanDistance(this.currentPosition.x, this.currentPosition.y)
      }
    } else {
      return {
        position: this.currentPosition,
        isValid: {
          result: this.isPositionValid(),
          reason: this.getInvalidPositionReason()
        },
        agentSurroundings: this.getAgentSurroundings(),
        distanceToEnd: this.calculateEuclideanDistance(this.currentPosition.x, this.currentPosition.y)
      }
    }
  }

  public isPositionACoin(x: number, y: number): boolean {
    return this.maze.getMaze()[x][y] === 'M'
  }

  public collectCoin(x: number, y: number): void {
    this.maze.getMaze()[x][y] = '0'
  }

}
