export class Maze {
  public maze: string[][]

  constructor() {
    this.maze = [
      ['E', '0', '0', '1', '0', 'M', '0', '0', 'M', '1'],
      ['0', '1', '0', 'M', '0', '1', '0', '1', '0', 'M'],
      ['0', '0', 'M', '0', '1', '1', 'M', '0', '1', '1'],
      ['M', '1', '1', '0', 'M', '1', '1', 'M', '0', '1'],
      ['M', '0', '0', '0', '0', '1', '1', '0', '1', '1'],
      ['1', '1', '1', '1', '0', '1', '1', '0', '1', '1'],
      ['1', '0', '1', '1', '0', '1', '1', 'M', '0', 'M'],
      ['M', '0', 'M', 'M', '0', '1', '1', '1', '1', '1'],
      ['1', 'M', '1', 'M', '0', '0', 'M', 'M', '1', '1'],
      ['1', 'M', '1', 'M', '1', 'M', '0', '0', '0', 'S'],
    ]
  }

  public setMaze(newMaze: string[][]) {
    this.maze = newMaze
  }
}
