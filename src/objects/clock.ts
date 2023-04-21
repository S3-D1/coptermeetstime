import { IImageConstructor } from '../interfaces/image.interface';
import Body = Phaser.Physics.Arcade.Body;

export class Clock extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;
    constructor(aParams: IImageConstructor) {
        super(
            aParams.scene,
            aParams.x,
            aParams.y,
            aParams.texture,
            aParams.frame
        );
        this.body = new Body(this.scene.physics.world, this);
        this.scene.physics.world.enable(this);
        this.body.setSize(20, 23);

        this.scene.add.existing(this);
    }
}
