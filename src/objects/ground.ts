import Body = Phaser.Physics.Arcade.Body;

interface ConstructorArgs {
    scene: Phaser.Scene;
    x: number;
    orientation: GroundOrientation;
    innerBound: number;
}

export enum GroundOrientation {
    TOP,
    BOTTOM,
}

export class Ground extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    public static readonly defaultHeight: number = 320;

    constructor(args: ConstructorArgs) {
        const y = Ground.calcY(args.orientation, args.innerBound);
        super(args.scene, args.x, y, 'ground');

        // physics
        this.body = new Body(this.scene.physics.world, this);
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setSize(32, Ground.defaultHeight);
        this.scene.add.existing(this);
        this.setOrigin(0, 0);
    }

    private static calcY(
        orientation: GroundOrientation,
        innerBound: number
    ): number {
        if (orientation === GroundOrientation.TOP) {
            return innerBound - Ground.defaultHeight;
        }
        if (orientation === GroundOrientation.BOTTOM) {
            return innerBound;
        }
        return 0;
    }
}
