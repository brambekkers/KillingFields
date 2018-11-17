import io from 'socket.io-client';
import Phaser from 'phaser';
import MainMenu from './scenes/attributes/MainMenu';
import LevelThree from './scenes/levels/LevelThree';
import InGameMenu from './scenes/attributes/InGameMenu';
import LobbyMenu from './scenes/attributes/LobbyMenu';
import Hud from './scenes/attributes/Hud';
import Credits from './scenes/attributes/Credits';

window.socket = io();

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    backgroundColor: '#f3e184',
    scene: [
        MainMenu,
        InGameMenu,
        LobbyMenu
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
    // Uitstraling in de Dev-tools
    title: 'KillingFields',
    banner: {
        text: '#ffffff',
        background: [
            '#fff200',
            '#38f0e8',
            '#00bff3',
            '#ec008c'
        ],
        hidePhaser: true
    }
});
