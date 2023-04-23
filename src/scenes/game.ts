import { Scene } from 'phaser';
import { Copter } from '../objects/copter';
import { Ground } from '../objects/ground';
import { Clock } from '../objects/clock';

export class GameScene extends Scene {
    private readonly groundMaxSize = 75;

    private movables!: Phaser.Physics.Arcade.Group;

    private copter!: Copter;
    private currentHeightTop: number;
    private currentHeightBottom: number;

    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;

    private timeLeft: number = 20;
    private timeLeftText!: Phaser.GameObjects.Text;
    private newClockSpawn: number = -1;

    private gameVelocity!: number;
    private gameOver: boolean = false;

    private readonly clockTime = 10;

    constructor() {
        super({ key: 'GameScene' });

        this.currentHeightTop = 1;
        this.currentHeightBottom = 1;
    }

    public preload(): void {
        this.load.image('ground', 'assets/ground-long.png');
        this.load.image('clock', 'assets/clock.png');
        this.load.spritesheet('copter', 'assets/copter.png', {
            frameWidth: 42,
            frameHeight: 26,
        });
        this.scoreText = this.add.text(16, 120, 'score: 0');
        this.timeLeftText = this.add.text(16, 140, 'time left: 0');
    }

    public create(): void {
        this.copter = new Copter({
            scene: this,
            x: 150,
            y: 150,
            texture: 'copter',
        });
        this.movables = this.physics.add.group();

        // generate ground
        for (let i = 0; i < (this.sys.game.canvas.width + 92) / 32; i++) {
            // generate bottom
            let random = Math.random();
            let offset = random * this.groundMaxSize;
            this.currentHeightBottom =
                this.sys.game.canvas.height - 32 - offset - 32;
            let g = new Ground({
                scene: this,
                x: i * 32,
                y: this.currentHeightBottom,
                texture: 'ground',
            });
            this.movables.add(g);

            // generate top
            random = Math.random();
            offset = random * this.groundMaxSize;
            this.currentHeightTop = -320 + offset + 32;
            g = new Ground({
                scene: this,
                x: i * 32,
                y: this.currentHeightTop,
                texture: 'ground',
            });
            this.newClockSpawn = -1;
            this.movables.add(g);
        }

        this.createClock();

        this.gameVelocity = -200;
        this.movables.setVelocityX(this.gameVelocity);
        this.score = 0;
        this.timeLeft = 20;
        this.gameOver = false;
        this.updateText();
    }

    private createClock(this: GameScene) {
        const upperBound = this.currentHeightTop + Ground.defaultHeight;
        const lowerBound = this.currentHeightBottom;
        const padding = 10;
        const range =
            lowerBound - padding - (upperBound + padding) - Clock.defaultHeight;
        const random = Math.random();
        const y = upperBound + padding + range * random;
        this.newClockSpawn = y;
        // generate clock
        const c = new Clock({
            scene: this,
            x: this.sys.game.canvas.width + 50,
            y,
            texture: 'clock',
        });
        this.time.delayedCall(
            0.8 * 1000 * this.clockTime,
            this.createClock,
            [],
            this
        );
        this.movables.add(c);
    }

    public update(): void {
        this.copter.update();
        if (this.gameOver) {
            this.add.text(360, 240, 'Game Over!');
            this.time.delayedCall(2000, this.restart, [], this);
        } else {
            // remove old ground and generate new one
            for (const go of this.movables.getChildren()) {
                switch (go.constructor.name) {
                    case Ground.name:
                        const g = go as Ground;
                        if (g.x < -32) {
                            const random = Math.random();
                            const offset = random * this.groundMaxSize;
                            let ngy: number;
                            if (g.y < 0) {
                                ngy = -320 + offset + 32;
                                if (
                                    ngy + Ground.defaultHeight >
                                    this.newClockSpawn
                                ) {
                                    ngy =
                                        this.newClockSpawn -
                                        10 -
                                        Ground.defaultHeight;
                                }
                                this.currentHeightTop = ngy;
                            } else {
                                ngy =
                                    this.sys.game.canvas.height -
                                    32 -
                                    offset -
                                    32;
                                if (ngy < this.newClockSpawn) {
                                    ngy = this.newClockSpawn - 10;
                                }
                                this.currentHeightBottom = ngy;
                            }
                            const ng = new Ground({
                                scene: this,
                                x: g.x + 32 + this.sys.game.canvas.width + 32,
                                y: ngy,
                                texture: 'ground',
                            });
                            this.movables.remove(g);
                            g.destroy();
                            this.movables.add(ng);
                        }
                        break;
                    case Clock.name:
                        const c = go as Clock;
                        if (c.x < -1 * c.width) {
                            this.movables.remove(c);
                            c.destroy();
                        }
                }
            }
        }
        this.movables.setVelocityX(this.gameVelocity);
        this.physics.overlap(this.copter, this.movables, (object1, object2) => {
            switch (object2.constructor.name) {
                case Ground.name:
                    this.setGameOver();
                    break;
                case Clock.name:
                    this.timeLeft += this.clockTime;
                    this.timeLeftText.setText('time left: ' + this.timeLeft);
                    object2.destroy();
            }
        });
    }

    private setGameOver() {
        this.gameOver = true;
        this.copter.gameOver();
        this.gameVelocity = 0;
    }

    public updateText(): void {
        if (!this.gameOver) {
            this.score++;
            this.scoreText.setText('score: ' + this.score);
            this.timeLeft--;
            this.timeLeftText.setText('time left: ' + this.timeLeft);
            if (this.timeLeft === 0) {
                this.setGameOver();
            } else {
                this.time.delayedCall(1000, this.updateText, [], this);
            }
        }
    }

    public restart(): void {
        this.scene.start('ScoreBoardScene', {
            score: this.score,
        });
    }
}
