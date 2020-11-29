"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maze = void 0;
class Maze {
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
        ];
    }
    setMaze(newMaze) {
        this.maze = newMaze;
    }
    getMaze() {
        return this.maze;
    }
}
exports.Maze = Maze;
//# sourceMappingURL=Maze.js.map