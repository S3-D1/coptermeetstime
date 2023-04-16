import { Scene } from 'phaser';
import { Copter } from '../objects/copter';

export class Main extends Scene {
    private copter!: Copter;

    constructor() {
        super({ key: 'main' });
    }

    public preload(): void {
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
    }

    public update(): void {
        this.copter.update();
    }
}
