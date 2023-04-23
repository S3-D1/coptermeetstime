import { Scene } from 'phaser';
import { Copter } from '../objects/copter';
import { Ground } from '../objects/ground';
import { Clock } from '../objects/clock';
import { Wall } from '../objects/wall';

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
    private newClockSpawn: number = Number.NEGATIVE_INFINITY;

    private gameVelocity!: number;
    private gameOver: boolean = false;

    private readonly clockTime = 10;

    constructor() {
        super({ key: 'GameScene' });

        this.currentHeightTop = 1;
        this.currentHeightBottom = 1;
    }

    public preload(): void {
        this.loadAssets();
        this.scoreText = this.add.text(16, 120, 'score: 0');
        this.timeLeftText = this.add.text(16, 140, 'time left: 0');
    }

    public create(): void {
        this.copter = new Copter({
            scene: this,
            x: 150,
            y: 150,
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
            this.movables.add(g);
        }

        this.createClock();
        this.createWall();

        this.gameVelocity = -200;
        this.movables.setVelocityX(this.gameVelocity);
        this.score = 0;
        this.timeLeft = 20;
        this.gameOver = false;
        this.updateText();
    }

    private createClock() {
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
    private createWall() {
        if (this.newClockSpawn > 0) {
            this.time.delayedCall(700, this.createWall, [], this);
            return;
        }
        const range = this.sys.canvas.height - Wall.defaultHeight;
        const random = Math.random();
        const y = range * random;
        // generate wall
        const w = new Wall({
            scene: this,
            x: this.sys.game.canvas.width + 50,
            y,
            texture: 'wall',
        });
        this.time.delayedCall(10 * random * 1000, this.createWall, [], this);
        this.movables.add(w);
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
                            const ngx =
                                g.x + 32 + this.sys.game.canvas.width + 32;
                            const random = Math.random();
                            const offset = random * this.groundMaxSize;
                            let ngy: number;
                            if (g.y < 0) {
                                ngy = -Ground.defaultHeight + offset + 32;
                                if (
                                    this.newClockSpawn <
                                    ngy + Ground.defaultHeight
                                ) {
                                    ngy =
                                        this.newClockSpawn -
                                        10 -
                                        Ground.defaultHeight;
                                    this.newClockSpawn =
                                        Number.NEGATIVE_INFINITY;
                                }
                                this.currentHeightTop = ngy;
                            } else {
                                ngy =
                                    this.sys.game.canvas.height -
                                    32 -
                                    offset -
                                    32;
                                if (
                                    ngy <
                                    this.newClockSpawn - Clock.defaultHeight
                                ) {
                                    ngy =
                                        this.newClockSpawn -
                                        Clock.defaultHeight -
                                        10;
                                    this.newClockSpawn =
                                        Number.NEGATIVE_INFINITY;
                                }
                                this.currentHeightBottom = ngy;
                            }
                            const ng = new Ground({
                                scene: this,
                                x: ngx,
                                y: ngy,
                                texture: 'ground',
                            });
                            g.destroy();
                            this.movables.add(ng);
                        }
                        break;
                    case Clock.name:
                        const c = go as Clock;
                        if (c.x < -1 * c.width) {
                            c.destroy();
                        }
                        break;
                    case Wall.name:
                        const w = go as Wall;
                        if (w.x < -1 * w.width) {
                            w.destroy();
                        }
                }
            }
        }
        this.movables.setVelocityX(this.gameVelocity);
        this.physics.overlap(this.copter, this.movables, (object1, object2) => {
            if (object1.constructor.name === Copter.name) {
                switch (object2.constructor.name) {
                    case Ground.name:
                    case Wall.name:
                        this.setGameOver();
                        break;
                    case Clock.name:
                        this.timeLeft += this.clockTime;
                        this.timeLeftText.setText(
                            'time left: ' + this.timeLeft
                        );
                        object2.destroy();
                }
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

    private loadAssets(): void {
        this.load.image('ground', 'assets/ground-long.png');
        this.load.image('clock', 'assets/clock.png');
        this.load.image('copter', 'assets/copter.png');
        this.load.spritesheet('wall', 'assets/ground-long.png', {
            frameWidth: 32,
            frameHeight: 180,
        });
    }
}
