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
            let height = random * this.groundMaxSize;
            this.currentHeightBottom =
                this.scene.sys.game.canvas.height - height - this.groundMinSize;
            let g = new Ground({
                scene: this.scene,
                x: i * 32,
                orientation: GroundOrientation.BOTTOM,
                innerBound: this.currentHeightBottom,
            });
            movables.add(g);

            // generate top
            random = Math.random();
            height = random * this.groundMaxSize;
            this.currentHeightTop = height + this.groundMinSize;
            g = new Ground({
                scene: this.scene,
                x: i * 32,
                orientation: GroundOrientation.TOP,
                innerBound: this.currentHeightTop,
            });
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
                        let innerBound: number;
                        let orientation: number;
                        if (g.y < 0) {
                            orientation = GroundOrientation.TOP;
                            innerBound = offset + this.groundMinSize;
                            if (
                                newClockSpawn > 0 &&
                                newClockSpawn < innerBound
                            ) {
                                innerBound = newClockSpawn - 10;
                            }
                            this.currentHeightTop = innerBound;
                        } else {
                            orientation = GroundOrientation.BOTTOM;
                            innerBound =
                                this.scene.sys.game.canvas.height -
                                32 -
                                offset -
                                this.groundMinSize;
                            if (
                                innerBound <
                                newClockSpawn - Clock.defaultHeight
                            ) {
                                innerBound =
                                    newClockSpawn + Clock.defaultHeight + 10;
                            }
                            this.currentHeightBottom = innerBound;
                        }
                        const ng = new Ground({
                            scene: this.scene,
                            x: ngx,
                            orientation,
                            innerBound,
                        });
                        g.destroy();
                        movables.add(ng);
                    }
                    break;
            }
        }
    }
}
