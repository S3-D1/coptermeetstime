import { Scene } from 'phaser';
import { Copter } from '../objects/copter';
import { Ground } from '../objects/ground';
import { Clock } from '../objects/clock';
import { Wall } from '../objects/wall';
import { GroundManager } from '../manager/ground-manager';
import { GameManager } from '../manager/game-manager';
import HTML5AudioSound = Phaser.Sound.HTML5AudioSound;
import { DifficultyManager } from '../manager/difficulty-manager';

export class GameScene extends Scene {
    private movables!: Phaser.Physics.Arcade.Group;

    private music!: Phaser.Sound.HTML5AudioSound;

    private copter!: Copter;

    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;

    private timeLeft!: number;
    private timeLeftText!: Phaser.GameObjects.Text;
    private newClockSpawn: number = Number.NEGATIVE_INFINITY;

    private gameOver: boolean = false;

    private readonly gameManager: GameManager;
    private readonly difficultyManager: DifficultyManager;
    private readonly groundManager: GroundManager;

    constructor() {
        super({ key: 'GameScene' });
        this.gameManager = new GameManager(this);
        this.difficultyManager = new DifficultyManager(this.gameManager);
        this.groundManager = new GroundManager(this, this.gameManager);
    }

    public preload(): void {
        this.loadAssets();
        this.scoreText = this.add.text(16, 120, 'score: 0');
        this.timeLeftText = this.add.text(16, 140, 'time left: 0');
    }

    public create(): void {
        this.gameManager.reset();
        this.anims.create({
            key: 'copter',
            frameRate: 24,
            frames: this.anims.generateFrameNumbers('copter', {
                start: 0,
                end: 9,
            }),
            repeat: -1,
        });
        this.copter = new Copter({
            scene: this,
            x: 150,
            y: 150,
            gameManager: this.gameManager,
        });
        this.copter.play('copter');
        this.movables = this.physics.add.group();

        // generate ground
        this.groundManager.setupGround(this.movables);

        this.createClock();
        this.createWall();

        this.movables.setVelocityX(this.gameManager.gameVelocity);
        this.score = 0;
        this.timeLeft = this.gameManager.initialTime;
        this.gameOver = false;
        this.updateText();
        this.music = this.sound.add('mainTheme', {
            loop: true,
        }) as HTML5AudioSound;
        this.music.setVolume(0.8);
        this.music.play();
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
        this.time.delayedCall(500, this.resetClockSpawn, [], this);
        this.time.delayedCall(
            this.gameManager.clockFrequency * 1000 * this.gameManager.clockTime,
            this.createClock,
            [],
            this
        );
        this.movables.add(c);
    }
    private createWall() {
        const range = this.sys.canvas.height - this.gameManager.wallHeight;
        const random = Math.random();
        const y = range * random;
        // generate wall
        const w = new Wall({
            scene: this,
            y,
            height: this.gameManager.wallHeight,
        });
        this.time.delayedCall(
            1000 *
                (this.gameManager.wallMinDistanceInSeconds +
                    this.gameManager.wallMaxVariableDistanceInSeconds * random),
            this.createWall,
            [],
            this
        );
        this.movables.add(w);
    }

    public update(): void {
        this.difficultyManager.update(this.score);
        this.music.setRate(this.gameManager.gameMusicRate);
        this.copter.update();
        if (this.gameOver) {
            this.add.text(300, 200, 'Game Over!', { fontSize: 36 });
            this.time.delayedCall(
                this.gameManager.restartTime,
                this.restart,
                [],
                this
            );
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
        this.movables.setVelocityX(this.gameManager.gameVelocity);
        this.physics.overlap(this.copter, this.movables, (object1, object2) => {
            if (object1.constructor.name === Copter.name) {
                switch (object2.constructor.name) {
                    case Ground.name:
                    case Wall.name:
                        this.setGameOver();
                        break;
                    case Clock.name:
                        this.timeLeft += this.gameManager.clockTime;
                        object2.destroy();
                }
            }
        });
    }

    private setGameOver() {
        this.music.stop();
        this.gameOver = true;
        this.copter.stop();
        this.copter.gameOver();
        this.gameManager.setGameVelocity(0);
    }

    public updateText(): void {
        if (!this.gameOver) {
            this.score++;
            this.scoreText.setText('score: ' + this.score);
            this.timeLeft--;
            this.timeLeftText.setText('time left: ' + this.timeLeft.toFixed(0));
            if (this.timeLeft <= 0) {
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
        this.load.spritesheet('wall', 'assets/ground-long.png', {
            frameWidth: 20,
            frameHeight: this.gameManager.wallHeight,
        });
    }

    public resetClockSpawn(): void {
        this.newClockSpawn = Number.NEGATIVE_INFINITY;
    }
}
