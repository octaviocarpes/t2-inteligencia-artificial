import {Maze} from "./Maze";
import {Directions, MazeValues} from "./constants/Directions";

interface Position {
  x: number,
  y: number
}

export class Agent {
  private maze: Maze
  private currentPosition: Position

  constructor(maze: Maze) {
    this.maze = maze
    this.currentPosition  = { x: 0, y: 0 }
  }

  private updateScoreBasedOnPositionValue(score: number): void {
    switch (this.maze.maze[this.currentPosition.x][this.currentPosition.y]) {
      case '0':
        score += 5
        break

      case '1':
        score -= 10
        break

      case 'M':
        score += 15
        break

      default: return
    }
  }

  private updatePosition(position: string, score: number) {
    switch (position) {
      case Directions.UP:
        if ((this.currentPosition.y - 1) < 0) {
          score -= 1
          return
        } else {
          this.currentPosition.y -= 1
          this.updateScoreBasedOnPositionValue(score)
        }
        break

      case Directions.DOWN:
        if ((this.currentPosition.y + 1) >= this.maze.maze.length) {
          score -= 1
          return
        } else {
          this.currentPosition.y += 1
          this.updateScoreBasedOnPositionValue(score)
          break
        }

      case Directions.LEFT:
        if ((this.currentPosition.x - 1) < 0) {
          score -= 1
          return
        } else {
          this.currentPosition.x -= 1
          this.updateScoreBasedOnPositionValue(score)
          break
        }

      case Directions.RIGHT:
        if ((this.currentPosition.x + 1) >= this.maze.maze.length) {
          score -= 1
          return
        } else {
          this.currentPosition.x += 1
          this.updateScoreBasedOnPositionValue(score)
          break
        }

      default: return
    }
  }

  public walk(path: string[]): number {
    let score = 0
    for(let i = 0; i < path.length; i++) {
      this.updatePosition(path[i], score)
    }
    return score
  }

}
