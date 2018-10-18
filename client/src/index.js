import io from 'socket.io-client';
import Phaser from 'phaser';
import MainMenu from './scenes/levels/MainMenu';

window.socket = io();

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    title: 'KillingFields',
    pixelArt: true,
    scene: [
        MainMenu,
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
