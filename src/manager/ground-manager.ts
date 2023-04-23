import { Ground, GroundOrientation } from '../objects/ground';
import { Clock } from '../objects/clock';

export class GroundManager {
    private readonly groundMaxSize: number = 75;
    private readonly groundMinSize: number = 32;

    public currentHeightTop: number = 0;
    public currentHeightBottom: number = 0;
    private scene: Phaser.Scene;

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
                height: this.currentHeightBottom,
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
                height: this.currentHeightTop,
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
                        let ngy: number;
                        if (g.y < 0) {
                            ngy = -Ground.defaultHeight + offset + 32;
                            if (newClockSpawn < ngy + Ground.defaultHeight) {
                                ngy = newClockSpawn - 10 - Ground.defaultHeight;
                                newClockSpawn = Number.NEGATIVE_INFINITY;
                            }
                            this.currentHeightTop = ngy;
                        } else {
                            ngy =
                                this.scene.sys.game.canvas.height -
                                32 -
                                offset -
                                32;
                            if (ngy < newClockSpawn - Clock.defaultHeight) {
                                ngy = newClockSpawn - Clock.defaultHeight - 10;
                                newClockSpawn = Number.NEGATIVE_INFINITY;
                            }
                            this.currentHeightBottom = ngy;
                        }
                        const ng = new Ground({
                            scene: this.scene,
                            x: ngx,
                            y: ngy,
                            orientation: GroundOrientation.BOTTOM,
                            height: 0,
                        });
                        g.destroy();
                        movables.add(ng);
                    }
                    break;
            }
        }
    }
}
