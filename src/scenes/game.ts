import { Scene } from 'phaser';
import { Copter } from '../objects/copter';
import { Ground } from '../objects/ground';

export class GameScene extends Scene {
    private readonly groundMaxSize = 75;

    private readonly groundTop: Phaser.GameObjects.Group;
    private readonly groundBottom: Phaser.GameObjects.Group;

    private copter!: Copter;
    private currentHeightTop: number;
    private currentHeightBottom: number;

    private newestTopGround!: Ground;
    private newestBottomGround!: Ground;

    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;

    private readonly totalTime: number = 999;
    private timeLeftText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'GameScene' });

        this.currentHeightTop = 1;
        this.currentHeightBottom = 1;
        this.groundTop = new Phaser.GameObjects.Group(this);
        this.groundBottom = new Phaser.GameObjects.Group(this);
    }

    public preload(): void {
        this.load.image('ground', 'assets/ground-long.png');
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

        // generate bottom
        for (let i = 0; i < (this.sys.game.canvas.width + 92) / 32; i++) {
            const random = Math.random();
            const offset = random * this.groundMaxSize;
            const g = new Ground({
                scene: this,
                x: i * 32,
                y: this.sys.game.canvas.height - 32 - offset - 32,
                texture: 'ground',
            });
            this.currentHeightBottom = random * this.groundMaxSize;
            this.groundBottom.add(g);
            this.newestBottomGround = g;
        }

        // generate top
        for (let i = 0; i < (this.sys.game.canvas.width + 92) / 32; i++) {
            const random = Math.random();
            const offset = random * this.groundMaxSize;
            const g = new Ground({
                scene: this,
                x: i * 32,
                y: -320 + offset + 32,
                texture: 'ground',
            });
            this.currentHeightTop = random * this.groundMaxSize;
            this.groundTop.add(g);
            this.newestTopGround = g;
        }
        this.score = 0;
        this.updateText();
    }

    public update(): void {
        console.log('top');
        console.log(this.groundTop.getLength());
        console.log('bottom');
        console.log(this.groundBottom.getLength());
        this.copter.update();
        if (this.copter.isCrashed) {
            this.scene.start('MenuScene', {
                reason: 'fail',
                score: this.score,
            });
        }

        if (!this.copter.isCrashed) {
            // collision top
            this.physics.overlap(
                this.copter,
                this.groundTop,
                () => {
                    this.copter.isCrashed = true;
                },
                () => {},
                this
            );
            // collision bottom
            this.physics.overlap(
                this.copter,
                this.groundBottom,
                () => {
                    this.copter.isCrashed = true;
                },
                () => {},
                this
            );
        }

        // remove old ground and generate new one
        for (const go of this.groundTop.getChildren()) {
            const g = go as Ground;
            if (g.x < -32) {
                this.groundTop.remove(g);
                g.destroy();
            }
        }
        for (const go of this.groundBottom.getChildren()) {
            const g = go as Ground;
            if (g.x < -32) {
                this.groundBottom.remove(g);
                g.destroy();
            }
        }

        // create new grounds
        if (this.newestTopGround.x < this.sys.canvas.width + 16) {
            const random = Math.random();
            const offset = random * this.groundMaxSize;
            const ng = new Ground({
                scene: this,
                x: this.newestTopGround.x + 28,
                y: -320 + offset + 32,
                texture: 'ground',
            });
            this.currentHeightTop = random * this.groundMaxSize;
            this.groundTop.add(ng);
            this.newestTopGround = ng;
        }
        if (this.newestBottomGround.x < this.sys.canvas.width + 16) {
            const random = Math.random();
            const offset = random * this.groundMaxSize;
            const ng = new Ground({
                scene: this,
                x: this.newestBottomGround.x + 28,
                y: this.sys.game.canvas.height - 32 - offset - 32,
                texture: 'ground',
            });
            this.currentHeightBottom = random * this.groundMaxSize;
            this.groundBottom.add(ng);
            this.newestBottomGround = ng;
        }
    }

    public updateText(): void {
        this.scoreText.setText('score: ' + this.score);
        this.timeLeftText.setText(
            'time left: ' + (this.totalTime - this.score)
        );
        this.score++;
        this.time.delayedCall(1000, this.updateText, [], this);
    }
}
