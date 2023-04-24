export class GameManager {
    private readonly scene: Phaser.Scene;

    public groundMinSize!: number;
    public groundMaxVariableSize!: number;

    public wallMinDistanceInSeconds: number = 0.5;
    public wallMaxVariableDistanceInSeconds: number = 3;
    public wallPreventionTime: number = 700;
    public wallHeight: number = 180;

    public gameVelocity!: number;
    public clockTime!: number;
    public clockFrequency!: number;
    public initialTime!: number;

    public restartTime!: number;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public reset() {
        this.groundMinSize = 20;
        this.groundMaxVariableSize = 65;

        this.wallMinDistanceInSeconds = 0.5;
        this.wallMaxVariableDistanceInSeconds = 3;

        this.gameVelocity = -200;
        this.clockTime = 10;
        this.clockFrequency = 0.8;
        this.initialTime = 20;

        this.restartTime = 2000;
    }

    setGameVelocity(newValue: number, setForTime: number = 0) {
        if (setForTime !== 0) {
            this.scene.time.delayedCall(
                setForTime * 1000,
                this.setGameVelocity,
                [this.gameVelocity],
                this
            );
        }
        this.gameVelocity = newValue;
    }
}
