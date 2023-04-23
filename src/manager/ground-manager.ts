import { Ground, GroundOrientation } from '../objects/ground';
import { Clock } from '../objects/clock';

export class GroundManager {
    private readonly groundMaxSize: number = 75;
    private readonly groundMinSize: number = 32;
    private readonly scene: Phaser.Scene;

    public currentHeightTop: number = 0;
    public currentHeightBottom: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public setupGround(movables: Phaser.Physics.Arcade.Group) {
        // generate ground
        for (let i = 0; i < (this.scene.sys.game.canvas.width + 92) / 32; i++) {
            // generate bottom
            let random = Math.random();
            let height = random * this.groundMaxSize + this.groundMinSize;

            let g = new Ground({
                scene: this.scene,
                x: i * 32,
                orientation: GroundOrientation.BOTTOM,
                height: height,
            });
            this.currentHeightBottom = g.y;
            movables.add(g);

            // generate top
            random = Math.random();
            height = random * this.groundMaxSize + this.groundMinSize;
            g = new Ground({
                scene: this.scene,
                x: i * 32,
                orientation: GroundOrientation.TOP,
                height: height,
            });
            this.currentHeightTop = g.y;
            movables.add(g);
        }
    }

    public update(
        movables: Phaser.Physics.Arcade.Group,
        newClockSpawn: number
    ) {
        // remove old ground and generate new one
        for (const go of movables.getChildren()) {
            switch (go.constructor.name) {
                case Ground.name:
                    const g = go as Ground;
                    if (g.x < -32) {
                        const ngx =
                            g.x + 32 + this.scene.sys.game.canvas.width + 32;
                        const random = Math.random();
                        const offset = random * this.groundMaxSize;
                        let boundaryHeight: number;
                        let orientation: number;
                        boundaryHeight = offset + this.groundMinSize;
                        if (g.y < 0) {
                            orientation = GroundOrientation.TOP;
                            if (
                                newClockSpawn > 0 &&
                                newClockSpawn < boundaryHeight
                            ) {
                                boundaryHeight = newClockSpawn - 10;
                            }
                        } else {
                            orientation = GroundOrientation.BOTTOM;
                            if (
                                this.scene.game.canvas.height - boundaryHeight <
                                newClockSpawn - Clock.defaultHeight
                            ) {
                                boundaryHeight =
                                    this.scene.game.canvas.height -
                                    newClockSpawn -
                                    Clock.defaultHeight -
                                    10;
                            }
                        }
                        const ng = new Ground({
                            scene: this.scene,
                            x: ngx,
                            orientation,
                            height: boundaryHeight,
                        });
                        switch (orientation) {
                            case GroundOrientation.TOP:
                                this.currentHeightTop = g.y;
                                break;
                            case GroundOrientation.BOTTOM:
                                this.currentHeightBottom = g.y;
                                break;
                        }

                        g.destroy();
                        movables.add(ng);
                    }
                    break;
            }
        }
    }
}
