const GAME_WIDTH = 2240;
const GAME_HEIGHT = 2240;

const socket = io();

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    pixelArt: true,
    scene: [
        LevelTwo,
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1500,
            },
            debug: true,
        },
    },
};
