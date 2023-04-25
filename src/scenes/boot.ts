export class BootScene extends Phaser.Scene {
    private progressBar!: Phaser.GameObjects.Graphics;

    constructor() {
        super({
            key: 'BootScene',
        });
    }

    preload(): void {
        this.load.audio('mainTheme', 'assets/MainTheme.wav');
        this.load.image('ground', 'assets/ground-long.png');
        this.load.image('clock', 'assets/clock.png');
        this.load.image('copter', 'assets/copter.png');

        this.add.text(100, 100, 'This is Copter meets Time!', {
            fontSize: 36,
        });
        this.add.text(100, 160, 'Just wait for fun - loading', {
            fontSize: 36,
        });

        this.progressBar = this.add.graphics();

        this.load.on(
            'progress',
            (value: number) => {
                this.progressBar.clear();
                this.progressBar.fillStyle(0xffffff, 1);
                this.progressBar.fillRect(
                    this.game.canvas.width / 4,
                    this.game.canvas.height / 2 - 16,
                    (this.game.canvas.width / 2) * value,
                    16
                );
            },
            this
        );
    }

    update(): void {
        this.scene.start('MenuScene', { reason: 'start' });
    }
}
