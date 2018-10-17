import io from 'socket.io-client';
import Phaser from 'phaser';
import LevelTwo from './scenes/levels/LevelTwo';

window.socket = io();

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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
});
