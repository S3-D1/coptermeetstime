import { Types } from 'phaser';
import { MenuScene } from './scenes/menu';
import { BootScene } from './scenes/boot';
import { GameScene } from './scenes/game';

const parent: string = 'game';

export class Game extends Phaser.Game {
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
            scene: [BootScene, MenuScene, GameScene],
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
