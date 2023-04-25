import { Scene } from 'phaser';
import { CopterMeetsTime } from '../copterMeetsTime';
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
        const game = this.game as CopterMeetsTime;
        game.scores.push(data.score);
        const leaders = game.scores.sort((n1, n2) => n2 - n1);
        for (let i = 0; i < 9; i++) {
            if (i + 1 > leaders.length) {
                return;
            }
            const text = this.add.text(
                100,
                100 + i * 15,
                i + 1 + '. .................... ' + leaders[i]
            );
            if (
                leaders[i] === data.score &&
                !(i + 1 < leaders.length && leaders[i + 1] === data.score)
            ) {
                text.setColor('orange');
            }
        }
        if (data.score <= leaders[9]) {
            const text = this.add.text(
                200,
                300,
                'Score: ' + data.score + ' Try harder!'
            );
            text.setColor('orange');
        }
    }

    create(): void {
        this.add.text(80, 30, 'ScoreBoard', { fontSize: 36 });

        this.add.text(
            80,
            400,
            'Press [SPACE], Click or Touch for another try',
            { fontSize: 20 }
        );
    }

    update() {
        if (this.startKey.isDown || this.input.activePointer.isDown) {
            this.scene.start('GameScene');
        }
    }
}
