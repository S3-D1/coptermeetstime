import Body = Phaser.Physics.Arcade.Body;

interface ConstructorArgs {
    scene: Phaser.Scene;
    y: number;
    height: number;
}

export class Wall extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    constructor(args: ConstructorArgs) {
        super(
            args.scene,
            args.scene.sys.game.canvas.width + 50,
            args.y,
            'wall'
        );

        // image
        this.setScale(1);
        this.setOrigin(0, 0);

        // physics
        this.body = new Body(this.scene.physics.world, this);
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setSize(20, args.height);
        this.scene.add.existing(this);
    }
}
