import Body = Phaser.Physics.Arcade.Body;
import { IImageConstructor } from '../interfaces/image.interface';

export class Copter extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;
    isCrashed: boolean;

    private readonly jumpKey: Phaser.Input.Keyboard.Key;

    constructor(aParams: IImageConstructor) {
        super(
            aParams.scene,
            aParams.x,
            aParams.y,
            aParams.texture,
            aParams.frame
        );

        this.isCrashed = false;

        // image
        this.setScale(3);
        this.setOrigin(0, 0);

        // physics
        this.body = new Body(this.scene.physics.world, this);
        this.scene.physics.world.enable(this);
        this.body.setSize(17, 12);

        this.scene.add.existing(this);

        this.body.setGravityY(1000);
        // input
        this.jumpKey = this.scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.jumpKey.isDown = false;
        this.scene.input.activePointer.isDown = false;
    }

    public update() {
        super.update();
        if (!this.isCrashed && (this.jumpKey.isDown || this.scene.input.activePointer.isDown)) {
            this.body.setVelocityY(-200);
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
