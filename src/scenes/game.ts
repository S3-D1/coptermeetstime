import { Scene } from 'phaser';
import { Copter } from '../objects/copter';
import { Ground } from '../objects/ground';
import { Clock } from '../objects/clock';

export class GameScene extends Scene {
    private readonly groundMaxSize = 75;

    private movables!: Phaser.Physics.Arcade.Group;

    private copter!: Copter;
    private clock!: Clock;
    private currentHeightTop: number;
    private currentHeightBottom: number;

    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;

    private timeLeft: number = 10;
    private timeLeftText!: Phaser.GameObjects.Text;

    private gameVelocity!: number;
    private gameOver: boolean = false;

    constructor() {
        super({ key: 'GameScene' });

        this.currentHeightTop = 1;
        this.currentHeightBottom = 1;
    }

    public preload(): void {
        this.load.image('ground', 'assets/ground-long.png');
        this.load.image('clock', 'assets/clock.png');
        this.load.spritesheet('copter', 'assets/copter.png', {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.scoreText = this.add.text(16, 120, 'score: 0');
        this.timeLeftText = this.add.text(16, 140, 'time left: 0');
    }

    public create(): void {
        this.copter = new Copter({
            scene: this,
            x: 150,
            y: 100,
            texture: 'copter',
        });
        this.movables = this.physics.add.group();

        // generate ground
        for (let i = 0; i < (this.sys.game.canvas.width + 92) / 32; i++) {
            // generate bottom
            let random = Math.random();
            let offset = random * this.groundMaxSize;
            let g = new Ground({
                scene: this,
                x: i * 32,
                y: this.sys.game.canvas.height - 32 - offset - 32,
                texture: 'ground',
            });
            this.currentHeightBottom = random * this.groundMaxSize;
            this.movables.add(g);

            // generate top
            random = Math.random();
            offset = random * this.groundMaxSize;
            g = new Ground({
                scene: this,
                x: i * 32,
                y: -320 + offset + 32,
                texture: 'ground',
            });
            this.currentHeightTop = random * this.groundMaxSize;
            this.movables.add(g);
        }

        // generate clock
        this.clock = new Clock({
            scene: this,
            x: this.sys.game.canvas.width + 50,
            y: this.sys.game.canvas.height / 2,
            texture: 'clock',
        });

        this.gameVelocity = -200;
        this.clock.body.setVelocityX(this.gameVelocity);
        this.movables.setVelocityX(this.gameVelocity);
        this.score = 0;
        this.gameOver = false;
        this.updateText();
    }

    public update(): void {
        this.copter.update();
        if (this.gameOver) {
            this.add.text(360, 240, 'Game Over!');
            this.time.delayedCall(2000, this.restart, [], this);
        } else {
            // remove old ground and generate new one
            for (const go of this.movables.getChildren()) {
                const g = go as Ground;
                if (g.x < -32) {
                    const random = Math.random();
                    const offset = random * this.groundMaxSize;
                    let ngy: number;
                    if (g.y < 0) {
                        this.currentHeightTop = random * this.groundMaxSize;
                        ngy = -320 + offset + 32;
                    } else {
                        this.currentHeightBottom = random * this.groundMaxSize;
                        ngy = this.sys.game.canvas.height - 32 - offset - 32;
                    }
                    const ng = new Ground({
                        scene: this,
                        x: g.x + 28 + this.sys.game.canvas.width + 32,
                        y: ngy,
                        texture: 'ground',
                    });
                    this.movables.remove(g);
                    g.destroy();
                    this.movables.add(ng);
                }
            }
        }
        if (this.clock.x < -32) {
            this.clock.destroy();

            this.clock = new Clock({
                scene: this,
                x: this.sys.game.canvas.width + 50,
                y: this.sys.game.canvas.height / 2,
                texture: 'clock',
            });
            this.clock.body.setVelocityX(this.gameVelocity);
        }
        this.movables.setVelocityX(this.gameVelocity);
        this.physics.overlap(this.copter, this.movables, (object1, object2) => {
            switch (object2.constructor.name) {
                case Ground.name:
                    this.setGameOver();
            }
        });
        this.physics.overlap(this.copter, this.clock, () => {
            this.timeLeft += 10;
            this.timeLeftText.setText('time left: ' + this.timeLeft);
            this.clock.destroy();

            this.clock = new Clock({
                scene: this,
                x: this.sys.game.canvas.width + 50,
                y: this.sys.game.canvas.height / 2,
                texture: 'clock',
            });
            this.clock.body.setVelocityX(this.gameVelocity);
        });
    }

    private setGameOver() {
        this.gameOver = true;
        this.copter.gameOver();
        this.gameVelocity = 0;
        this.clock.body.setVelocityX(0);
    }

    public updateText(): void {
        if (!this.gameOver) {
            this.score++;
            this.scoreText.setText('score: ' + this.score);
            this.timeLeft = this.timeLeft - 1;
            this.timeLeftText.setText('time left: ' + this.timeLeft);
            if (this.timeLeft === 0) {
                this.setGameOver();
            } else {
                this.time.delayedCall(1000, this.updateText, [], this);
            }
        }
    }

    public restart(): void {
        this.scene.start('MenuScene', {
            reason: 'fail',
            score: this.score,
        });
        this.timeLeft = 10;
    }
}