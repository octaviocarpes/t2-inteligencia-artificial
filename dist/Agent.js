"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const Directions_1 = require("./constants/Directions");
class Agent {
    constructor(maze) {
        this.maze = maze;
        this.currentPosition = { x: 0, y: 0 };
        this.rota = [[0, 0]];
    }
    updatePosition(position) {
        switch (position) {
            case Directions_1.Directions.UP:
                this.currentPosition.y -= 1;
                break;
            case Directions_1.Directions.DOWN:
                this.currentPosition.y += 1;
                break;
            case Directions_1.Directions.LEFT:
                this.currentPosition.x -= 1;
                break;
            case Directions_1.Directions.RIGHT:
                this.currentPosition.x += 1;
                break;
            default:
                return;
        }
    }
    getInvalidPositionReason() {
        const { x, y } = this.currentPosition;
        if (this.isPositionWall(x, y))
            return 'Agent hit a wall';
        else
            return 'Agent went out of bounds';
    }
    isInsideMaze(x, y) {
        if (x < 0 || x > 10 || y < 0 || y > 10) {
            return false;
        }
        return true;
    }
    isPositionWall(x, y) {
        if (this.isInsideMaze(x, y)) {
            const { maze } = this.maze;
            if (maze[x][y] === '1') {
                return true;
            }
            return false;
        }
        return false;
    }
    calculateEuclideanDistance(x, y) {
        let coordinate = [x, y];
        let dif_y = Math.abs(coordinate[1] - 12);
        let dif_x = Math.abs(coordinate[0] - 12);
        let distance = Math.sqrt(dif_y * dif_y + dif_x * dif_x);
        return distance;
    }
    isPositionValid() {
        const { x, y } = this.currentPosition;
        return this.isInsideMaze(x, y) && !this.isPositionWall(x, y);
    }
    getPositionValue(x, y) {
        const { maze } = this.maze;
        if (this.isInsideMaze(x, y)) {
            switch (maze[x][y]) {
                case '1':
                    return 0; // Parede
                case '0':
                    return 1; // Caminho livre
                case 'M':
                    return 2; // Moeda
                case 'E':
                    return 1;
                case 'S':
                    return 100;
                default:
                    return -1;
            }
        }
        return -1; // Fora do labirinto
    }
    createAgentSurrounding(x, y) {
        return {
            value: this.getPositionValue(x, y),
            distance: this.calculateEuclideanDistance(x, y)
        };
    }
    getAgentSurroundings() {
        const { x, y } = this.currentPosition;
        const leftView = x - 1;
        const rightView = x + 1;
        const topView = y - 1;
        const bottomView = y + 1;
        const left = this.createAgentSurrounding(leftView, y);
        const right = this.createAgentSurrounding(rightView, y);
        const up = this.createAgentSurrounding(x, topView);
        const down = this.createAgentSurrounding(x, bottomView);
        return [left, up, right, down];
    }
    walk(path) {
        this.updatePosition(path);
        if (this.isPositionValid()) {
            return {
                position: this.currentPosition,
                isValid: {
                    result: this.isPositionValid()
                },
                agentSurroundings: this.getAgentSurroundings(),
                distanceToEnd: this.calculateEuclideanDistance(this.currentPosition.x, this.currentPosition.y)
            };
        }
        else {
            return {
                position: this.currentPosition,
                isValid: {
                    result: this.isPositionValid(),
                    reason: this.getInvalidPositionReason()
                },
                agentSurroundings: this.getAgentSurroundings(),
                distanceToEnd: this.calculateEuclideanDistance(this.currentPosition.x, this.currentPosition.y)
            };
        }
    }
}
exports.Agent = Agent;
//# sourceMappingURL=Agent.js.map