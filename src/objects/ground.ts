import Body = Phaser.Physics.Arcade.Body;

interface ConstructorArgs {
    scene: Phaser.Scene;
    x: number;
    orientation: GroundOrientation;
    height: number;
}

export enum GroundOrientation {
    TOP,
    BOTTOM,
}

export class Ground extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;
    groundOrientation: GroundOrientation;

    public static readonly defaultHeight: number = 320;

    constructor(args: ConstructorArgs) {
        const y = Ground.calcY(
            args.orientation,
            args.height,
            args.scene.game.canvas.height
        );
        super(args.scene, args.x, y, 'ground');
        this.groundOrientation = args.orientation;

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
        height: number,
        gameHeight: number
    ): number {
        if (orientation === GroundOrientation.TOP) {
            return height - Ground.defaultHeight;
        }
        if (orientation === GroundOrientation.BOTTOM) {
            return gameHeight - height;
        }
        return 0;
    }

    public getInnerBound(): number {
        switch (this.groundOrientation) {
            case GroundOrientation.TOP:
                return this.y + Ground.defaultHeight;
            case GroundOrientation.BOTTOM:
                return this.y;
        }
    }
}
