import { Scene } from 'phaser';

export class Main extends Scene {
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
        const player = this.physics.add.sprite(300, 300, 'copter');
    }
}
