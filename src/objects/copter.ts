import Body = Phaser.Physics.Arcade.Body;

interface ConstructorArgs {
    scene: Phaser.Scene;
    x: number;
    y: number;
}
export class Copter extends Phaser.GameObjects.Image {
    private static readonly MAX_SPEED: number = 200;
    private static readonly ACCELERATION: number = 20;
    private static readonly GRAVITY: number = 900;

    body: Phaser.Physics.Arcade.Body;
    isCrashed: boolean;

    private readonly jumpKey: Phaser.Input.Keyboard.Key;

    constructor(aParams: ConstructorArgs) {
        super(aParams.scene, aParams.x, aParams.y, 'copter');

        this.isCrashed = false;

        // image
        this.setScale(1);
        this.setOrigin(0, 0);

        // physics
        this.body = new Body(this.scene.physics.world, this);
        this.scene.physics.world.enable(this);
        this.body.setSize(42, 26);

        this.scene.add.existing(this);

        this.body.setGravityY(Copter.GRAVITY);
        // input
        this.jumpKey = this.scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.jumpKey.isDown = false;
        this.scene.input.activePointer.isDown = false;
    }

    public update() {
        super.update();
        if (
            !this.isCrashed &&
            (this.jumpKey.isDown || this.scene.input.activePointer.isDown)
        ) {
            const acc = Math.max(
                this.body.velocity.y - Copter.ACCELERATION,
                -Copter.MAX_SPEED
            );
            this.body.setVelocityY(acc);
        }
    }

    public gameOver(): void {
        this.isCrashed = true;
        this.jumpKey.isDown = false;
        this.scene.input.activePointer.isDown = false;
        this.jumpKey.enabled = false;
        this.body.setGravityY(0);
        this.body.setVelocityY(0);
    }
}
