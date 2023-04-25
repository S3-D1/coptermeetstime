import { GameManager } from './game-manager';

export class DifficultyManager {
    private readonly gameManager: GameManager;
    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
    }
    update(score: number) {
        if (score > 300) {
            this.gameManager.gameMusicRate = 2;
            this.gameManager.wallMinDistanceInSeconds = 0.5;
            this.gameManager.wallMaxVariableDistanceInSeconds = 2;
            return;
        }
        if (score > 270) {
            this.gameManager.gameMusicRate = 1.9;
            this.gameManager.wallMaxVariableDistanceInSeconds = 1.5;
            return;
        }
        if (score > 240) {
            this.gameManager.gameMusicRate = 1.8;
            this.gameManager.groundMinSize = 30;

            return;
        }
        if (score > 210) {
            this.gameManager.gameMusicRate = 1.7;
            this.gameManager.wallMinDistanceInSeconds = 1;
            return;
        }
        if (score > 180) {
            this.gameManager.gameMusicRate = 1.6;
            this.gameManager.groundMaxVariableSize = 80;
            this.gameManager.clockTime = 6;
            this.gameManager.clockFrequency = 0.9;
            return;
        }
        if (score > 150) {
            this.gameManager.gameMusicRate = 1.5;
            this.gameManager.wallMaxVariableDistanceInSeconds = 2;
            return;
        }
        if (score > 120) {
            this.gameManager.gameMusicRate = 1.4;
            this.gameManager.wallMaxVariableDistanceInSeconds = 2.5;
            return;
        }
        if (score > 90) {
            this.gameManager.gameMusicRate = 1.3;
            this.gameManager.wallMinDistanceInSeconds = 1.5;
            this.gameManager.clockTime = 8;
            return;
        }
        if (score > 60) {
            this.gameManager.gameMusicRate = 1.2;
            this.gameManager.wallMaxVariableDistanceInSeconds = 3;
            return;
        }
        if (score > 30) {
            this.gameManager.gameMusicRate = 1.1;
            this.gameManager.wallMaxVariableDistanceInSeconds = 3.5;
            return;
        }
    }
}
