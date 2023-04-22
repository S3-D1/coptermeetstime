import { Scene } from 'phaser';
import {CopterMeetsTime} from "../copterMeetsTime";
export interface InitArgs {
    score: number;
}

export class ScoreBoardScene extends Scene {
    private startKey!: Phaser.Input.Keyboard.Key;

    constructor() {
        super({ key: 'ScoreBoardScene' });
    }

    init(data: InitArgs): void {
        this.startKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.startKey.isDown = false;
        const game = this.game as CopterMeetsTime
        game.scores.push(data.score);
        const leaders = game.scores.sort((n1, n2) => n2 - n1 )
        for ( let i = 0; i < 9; i++) {
            if (i+1 > leaders.length) {
                return;
            }
            if(leaders[i] === data.score && !(i+1<leaders.length && leaders[i+1] === data.score)) {
                this.add.text(30,70 + i*15, i+1 + ". >>>>>>>>>>>>>>>>>>>> " + leaders[i]);
            } else {
                this.add.text(30,70 + i*15, i+1 + ". .................... " + leaders[i]);
            }
        }
        if (data.score <= leaders[9]) {
            this.add.text(200,250, "Score " + data.score + " is too bad!");
        }
    }

    create(): void {
        this.add.text(30,30, 'ScoreBoard');

        this.add.text(150, 400, 'Press [SPACE], Click or Touch for another try');
    }

    update() {
        if (this.startKey.isDown || this.input.activePointer.isDown) {
            this.scene.start('GameScene');
        }
    }
}
