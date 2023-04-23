import { IImageConstructor } from '../interfaces/image.interface';
import Body = Phaser.Physics.Arcade.Body;

interface ConstructorArgs {
    scene: Phaser.Scene;
    x: number;
    orientation: GroundOrientation;
    height: number;
    y?: number;
}

export enum GroundOrientation {
    TOP,
    BOTTOM,
}

export class Ground extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    public static readonly defaultHeight: number = 320;

    constructor(args: ConstructorArgs) {
        const y =
            args.y ||
            Ground.calcY(
                args.orientation,
                args.height,
                args.scene.sys.game.canvas.height
            );
        super(args.scene, args.x, y, 'ground');

        // physics
        this.body = new Body(this.scene.physics.world, this);
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setSize(32, Ground.defaultHeight);
        this.scene.add.existing(this);
    }

    private static calcY(
        orientation: GroundOrientation,
        height: number,
        canvasHeight: number
    ): number {
        if (orientation === GroundOrientation.TOP) {
            return -Ground.defaultHeight + height;
        }
        if (orientation === GroundOrientation.BOTTOM) {
            return canvasHeight - height;
        }
        return 0;
    }
}
