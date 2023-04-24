export class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'BootScene',
        });
    }

    preload(): void {
        this.load.audio('mainTheme', 'assets/MainTheme.wav');
    }

    update(): void {
        this.scene.start('MenuScene', { reason: 'start' });
    }
}
