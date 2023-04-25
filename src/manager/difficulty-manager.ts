import { GameManager } from './game-manager';

export class DifficultyManager {
    private readonly gameManager: GameManager;
    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
    }
    update(score: number) {
        if (score > 150) {
            this.gameManager.gameMusicRate = 1.2;
            this.gameManager.wallMinDistanceInSeconds = 0.5;
            this.gameManager.wallMaxVariableDistanceInSeconds = 2;
            return;
        }
        if (score > 135) {
            this.gameManager.wallMaxVariableDistanceInSeconds = 1.5;
            return;
        }
        if (score > 120) {
            this.gameManager.gameMusicRate = 1.15;
            this.gameManager.groundMinSize = 30;

            return;
        }
        if (score > 105) {
            this.gameManager.wallMinDistanceInSeconds = 0.8;
            return;
        }
        if (score > 90) {
            this.gameManager.gameMusicRate = 1.1;
            this.gameManager.groundMaxVariableSize = 80;
            this.gameManager.clockTime = 6;
            this.gameManager.clockFrequency = 0.9;
            return;
        }
        if (score > 75) {
            this.gameManager.wallMaxVariableDistanceInSeconds = 2;
            return;
        }
        if (score > 60) {
            this.gameManager.gameMusicRate = 1.05;
            this.gameManager.wallMaxVariableDistanceInSeconds = 2.5;
            return;
        }
        if (score > 45) {
            this.gameManager.wallMinDistanceInSeconds = 1.2;
            this.gameManager.clockTime = 8;
            return;
        }
        if (score > 30) {
            this.gameManager.wallMaxVariableDistanceInSeconds = 3;
            return;
        }
        if (score > 15) {
            this.gameManager.wallMaxVariableDistanceInSeconds = 3.5;
            return;
        }
    }
}
