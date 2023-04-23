import { Types } from 'phaser';
import { MenuScene } from './scenes/menu';
import { BootScene } from './scenes/boot';
import { GameScene } from './scenes/game';
import { ScoreBoardScene } from './scenes/score';

const parent: string = 'game';

export class CopterMeetsTime extends Phaser.Game {
    public readonly scores: number[] = [];
    constructor() {
        const config: Types.Core.GameConfig = {
            title: 'Copter meets Time',
            url: 'https://github.com/S3-D1/coptermeetstime',
            type: Phaser.AUTO,
            width: 720,
            height: 480,
            parent,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                },
            },
            fps: {
                min: 40,
                target: 40,
            },
            scene: [BootScene, MenuScene, GameScene, ScoreBoardScene],
            render: {
                pixelArt: true,
            },
            audio: {
                disableWebAudio: true,
            },
        };
        super(config);
    }
}
