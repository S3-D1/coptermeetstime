import { Scene } from 'phaser';
import { Copter } from '../objects/copter';
import { Ground } from '../objects/ground';
import { Clock } from '../objects/clock';
import { Wall } from '../objects/wall';
import { GroundManager } from '../manager/ground-manager';

export class GameScene extends Scene {
    private movables!: Phaser.Physics.Arcade.Group;

    private copter!: Copter;

    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;

    private timeLeft: number = 20;
    private timeLeftText!: Phaser.GameObjects.Text;
    private newClockSpawn: number = Number.NEGATIVE_INFINITY;

    private readonly wallFrequency: number = 7;

    private gameVelocity!: number;
    private gameOver: boolean = false;

    private readonly groundManager: GroundManager;

    private readonly clockTime = 10;

    constructor() {
        super({ key: 'GameScene' });

        this.groundManager = new GroundManager(this);
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
        this.groundManager.setupGround(this.movables);

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
        const upperBound = this.groundManager.currentHeightTop;
        const lowerBound = this.groundManager.currentHeightBottom;
        const padding = 20;
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
        this.time.delayedCall(300, this.resetClockSpwan, [], this);
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
        this.time.delayedCall(
            this.wallFrequency * random * 1000,
            this.createWall,
            [],
            this
        );
        this.movables.add(w);
    }

    public update(): void {
        this.copter.update();
        if (this.gameOver) {
            this.add.text(360, 240, 'Game Over!');
            this.time.delayedCall(2000, this.restart, [], this);
        } else {
            this.groundManager.update(this.movables, this.newClockSpawn);
            // remove old ground and generate new one
            for (const go of this.movables.getChildren()) {
                switch (go.constructor.name) {
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
            frameWidth: 20,
            frameHeight: Wall.defaultHeight,
        });
    }

    public resetClockSpwan(): void {
        this.newClockSpawn = Number.NEGATIVE_INFINITY;
    }
}
