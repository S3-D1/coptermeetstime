import { Scene } from 'phaser';
import { Copter } from '../objects/copter';
import { Ground } from '../objects/ground';

export class Main extends Scene {
    private copter!: Copter;
    private readonly ground: Phaser.GameObjects.Group;

    constructor() {
        super({ key: 'MainScene' });

        this.ground = new Phaser.GameObjects.Group(this);
    }

    public preload(): void {
        this.load.image('ground', 'assets/ground.png');
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
        for (let i = 0; i < this.sys.game.canvas.width / 32; i++) {
            this.ground.add(
                new Ground({
                    scene: this,
                    x: i * 32,
                    y: this.sys.game.canvas.height - 32,
                    texture: 'ground',
                })
            );
        }

        // generate top
        for (let i = 0; i < this.sys.game.canvas.width / 32; i++) {
            this.ground.add(
                new Ground({
                    scene: this,
                    x: i * 32,
                    y: 0,
                    texture: 'ground',
                })
            );
        }
    }

    public update(): void {
        this.copter.update();
        if (this.copter.isCrashed) {
            this.scene.start('MenuScene', {reason: 'fail'});
        }

        if (!this.copter.isCrashed) {
            this.physics.overlap(
                this.copter,
                this.ground,
                () => {
                    this.copter.isCrashed = true;
                },
                () => {},
                this
            );
        }
    }
}
