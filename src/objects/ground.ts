import { IImageConstructor } from '../interfaces/image.interface';
import Body = Phaser.Physics.Arcade.Body;

export class Ground extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    constructor(aParams: IImageConstructor) {
        super(
            aParams.scene,
            aParams.x,
            aParams.y,
            aParams.texture,
            aParams.frame
        );

        // image
        this.setScale(1);
        this.setOrigin(0, 0);

        // physics
        this.body = new Body(this.scene.physics.world, this);
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setSize(32, 320);

        this.scene.add.existing(this);
    }
}
