import { Scene } from 'phaser';
export interface InitArgs {
    reason: string;
    score: number;
}

export class MenuScene extends Scene {
    private startKey!: Phaser.Input.Keyboard.Key;

    constructor() {
        super({key: 'MenuScene'});

    }


    init(data: InitArgs): void {
        this.startKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.startKey.isDown = false;
        switch (data.reason) {
            case 'start':
                this.add.text(300,100, "Welcome to Copter meets Time!");
                break;
            case 'fail':
                if(data.score > 30){
                    this.add.text(300,100, "Well Done! Try Again: Copter meets Time");
                } else {
                    this.add.text(300,100, "NOOB! Try Again: Copter meets Time");
                }
                break;
            default:
                break;
        }
    }

    create(): void {
        this.add.text(300,200, "Press [SPACE] to start")
    }

    update() {
        if(this.startKey.isDown){
            this.scene.start('GameScene')
        }
    }
}
