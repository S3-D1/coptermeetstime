import { Scene } from 'phaser';
export class MenuScene extends Scene {
    private startKey!: Phaser.Input.Keyboard.Key;

    constructor() {
        super({ key: 'MenuScene' });
    }

    init(): void {
        this.startKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.startKey.isDown = false;
    }

    create(): void {
        this.add.text(100, 100, 'This is Copter meets Time!', {
            fontSize: 36,
        });
        const copter = this.add.image(360, 250, 'copter');
        copter.setScale(3, 3);
        this.add.text(100, 340, 'Press [SPACE], Click or Touch to start', {
            fontSize: 24,
        });
    }

    update() {
        if (this.startKey.isDown || this.input.activePointer.isDown) {
            this.scene.start('GameScene');
        }
    }
}
