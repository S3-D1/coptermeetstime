import { Scene } from 'phaser';
import { Copter } from '../objects/copter';
import { Ground } from '../objects/ground';

export class Main extends Scene {
    private readonly groundMaxSize = 100;

    private readonly groundTop: Phaser.GameObjects.Group;
    private readonly groundBottom: Phaser.GameObjects.Group;

    private copter!: Copter;
    private currentHeightTop: number;
    private currentHeightBottom: number;

    constructor() {
        super({ key: 'MainScene' });

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
    }

    public create(): void {
        this.copter = new Copter({
            scene: this,
            x: 50,
            y: 100,
            texture: 'copter',
        });

        // generate bottom
        for (let i = 0; i <= this.sys.game.canvas.width / 32; i++) {
            const random = Math.random();
            const offset = random * this.groundMaxSize;
            const g = new Ground({
                scene: this,
                x: i * 32,
                y: this.sys.game.canvas.height - 32 - offset,
                texture: 'ground',
            });
            this.currentHeightBottom = random * this.groundMaxSize;
            console.log(this.currentHeightBottom);
            this.groundBottom.add(g);
        }

        // generate top
        for (let i = 0; i <= this.sys.game.canvas.width / 32; i++) {
            const random = Math.random();
            const offset = random * this.groundMaxSize;
            const g = new Ground({
                scene: this,
                x: i * 32,
                y: -320 + offset,
                texture: 'ground',
            });
            this.currentHeightTop = random * this.groundMaxSize;
            this.groundTop.add(g);
        }
    }

    public update(): void {
        this.copter.update();
        if (this.copter.isCrashed) {
            this.scene.start('MenuScene', { reason: 'fail' });
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
            console.log(g);
            if (g.x < -32) {
                this.groundTop.remove(g);
                g.destroy();
                const random = Math.random();
                const offset = random * this.groundMaxSize;
                const ng = new Ground({
                    scene: this,
                    x: this.sys.canvas.width + 32,
                    y: -320 + offset,
                    texture: 'ground',
                });
                this.currentHeightTop = random * this.groundMaxSize;
                this.groundTop.add(ng);
            }
        }
        for (const go of this.groundBottom.getChildren()) {
            const g = go as Ground;
            if (g.x < -32) {
                this.groundBottom.remove(g);
                g.destroy();
                const random = Math.random();
                const offset = random * this.groundMaxSize;
                const ng = new Ground({
                    scene: this,
                    x: this.sys.canvas.width + 32,
                    y: this.sys.game.canvas.height - 32 - offset,
                    texture: 'ground',
                });
                this.currentHeightBottom = random * this.groundMaxSize;
                this.groundBottom.add(ng);
            }
        }
    }
}
