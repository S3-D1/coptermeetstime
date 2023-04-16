import { Types } from 'phaser';
import { Main } from './scenes/main';

const parent: string = 'game';

export class Game extends Phaser.Game {
    constructor() {
        const config: Types.Core.GameConfig = {
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
            scene: [Main],
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
