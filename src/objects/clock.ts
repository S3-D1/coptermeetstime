import { IImageConstructor } from '../interfaces/image.interface';
import Body = Phaser.Physics.Arcade.Body;

export class Clock extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;
    public static readonly defaultWidth = 20;
    public static readonly defaultHeight = 20;

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
        this.body.setSize(Clock.defaultWidth, Clock.defaultHeight);

        this.scene.add.existing(this);
    }
}
