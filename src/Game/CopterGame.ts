import { Game, Types } from 'phaser';

const parent: string = 'game';

export class CopterGame extends Game {
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
            scene: [],
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
