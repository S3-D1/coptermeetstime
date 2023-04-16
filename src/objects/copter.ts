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
        this.body.setGravityY(1000);
        this.body.setSize(17, 12);

        // input
        this.jumpKey = this.scene.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        this.scene.add.existing(this);
    }

    public update() {
        super.update();
        if (this.jumpKey.isDown) {
            this.body.setVelocityY(-350);
        }

        // check boundaries
        if(this.y < 0 || this.y + this.height > this.scene.sys.canvas.height) {
            this.isCrashed = true;
        }
    }
}
