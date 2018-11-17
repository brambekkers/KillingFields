import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import Button from '../../sprites/Button';
import LevelThree from '../levels/LevelThree';
import Credits from '../attributes/Credits';

import { createContext } from 'vm';


/**
 * @abstract
 */
export default class MainMenu extends Scene {
    
    constructor(config) {
        super({
            key: "MainMenu"
        });
    }

    dimensions = new Vector2(
        window.innerWidth,
        window.innerHeight
    );
    background;
    backgroundLogo;
    cursor;

    backgroundMusic

    MusicMute = false
    SoundMute = false


    /**
     * Stop all things in main menu 
     */
    ExitMainMenu = () => {
        this.backgroundMusic.stop();

        this.scene.sleep()
        this.startGame()
    }

    /**
     * Start new scenes 
     */
    startGame(){
        this.scene.add("LevelThree", LevelThree, true);
        // this.scene.start("LevelThree");
        this.scene.launch("Hud");
        this.scene.bringToTop("Hud")

        this.scene.stop("MainMenu")
    }

    lobbyMenu = ()=>{
        this.scene.pause("MainMenu")
        
        this.scene.launch('LobbyMenu');
        this.scene.bringToTop("LobbyMenu")
    }

    /**
     * 
     */
    createMusic(){
        this.backgroundMusic = this.sound.add('backgroundMusic');
    }

    muteMusic = () => {
        this.MusicMute = !this.MusicMute
        this.backgroundMusic.setMute(this.MusicMute);

        let button = this.soundButtons.filter(b => b.texture === "muteMusicButton")
        button[0].sprite.changeSoundButton(button[0], this.MusicMute)
    }
    muteSound = () => {        
        this.SoundMute = !this.SoundMute

        let button = this.soundButtons.filter(b => b.texture === "muteSoundButton")
        button[0].sprite.changeSoundButton(button[0], this.SoundMute)

        // mute/unmute all buttons
        for (const button of this.menuButtons) {
            button.sprite.muteClickSound(this.SoundMute)
        }
        for (const button of this.soundButtons) {
            button.sprite.muteClickSound(this.SoundMute)
        }
        
    }

    credits = ()=>{
        this.scene.add('Credits', new Credits(), true);

        this.backgroundMusic.stop();
        this.scene.stop("MainMenu")
    }



    menuButtons = [
        {sprite: null, name: "Quick play ", x:0, y:0, texture: "buttonBackground", scale:0.3, callback: this.ExitMainMenu },
        {sprite: null, name: "Lobby ", x:0, y:0, texture: "buttonBackground", scale:0.3, callback: this.lobbyMenu },
        {sprite: null, name: "Options ", x:0, y:0, texture: "buttonBackground", scale:0.3, callback: ()=>{ console.log("Clicked on Options")} },
        {sprite: null, name: "Exit ", x:0, y:0, texture: "buttonBackground", scale:0.3, callback: ()=>{ console.log("Clicked on Exit")} },

    ];
    soundButtons = [
        {sprite: null, scale: 0.3, x:0, y:0, texture: "muteMusicButton", textureOff: "musicButton", callback: this.muteMusic },
        {sprite: null, scale: 0.3, x:0, y:0, texture: "muteSoundButton", textureOff: "soundButton", callback: this.muteSound },
    ];
    creditButton = {sprite: null, scale: 1.2, x:100, y: this.dimensions.y -70, texture: "CreditRock", callback: this.credits }


   


    preload() {
        Button.preload(this)
        this.load.image('backgroundMainMenu', 'assets/img/backgroundMainMenu.png');
        this.load.image('achtergrondLogo', 'assets/img/Menu/achtergrondlogo.png');

        // Audio
        this.load.audio('backgroundMusic', 'assets/audio/Music/background7.ogg');
       
        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')        
    }



    create(){
        this.createPointer();
        this.createBackground();
        this.createMenuButton();
        this.createSoundButton();
        this.createCreditButton();
        this.createMusic();

        this.backgroundMusic.play();
        this.backgroundMusic.setLoop(true);

                
        // font
        WebFont.load({
            google: {
                families: ['Knewave']
            },
            active: ()=>{
                for (const menuButton of this.menuButtons) {
                    menuButton.sprite.setFont();    
                }
            }
        });
    }

    createBackground() {
        this.background = this.add.image(0, 0, 'backgroundMainMenu').setOrigin(0).setDisplaySize(this.dimensions.x, this.dimensions.y);
        this.backgroundLogo = this.add.image(this.dimensions.x/2, 0, `achtergrondLogo`).setOrigin(0.5, 0).setScale(0.6)

    }

    createMenuButton() {
        let buttonAmount = this.menuButtons.length - 1
        let buttonHeight = buttonAmount * 110
        let buttonHeightHalf = buttonHeight / 2

        for (const [index, button] of this.menuButtons.entries()) {
            button.x = this.dimensions.x / 2
            button.y = (this.dimensions.y / 1.7) + (index * 110) - buttonHeightHalf

            button.sprite = new Button(this, button);
        }
    }

    createPointer(){
        this.cursor = this.input.setDefaultCursor('url(assets/img/Cursor/Cursor2_Small.cur), pointer')
    }

    createSoundButton(){
        let buttonAmount = this.soundButtons.length - 1
        let buttonWidth = buttonAmount * 100

        for (const [index, button] of this.soundButtons.entries()) {
            button.x = this.dimensions.x - (index * 100) - 70
            button.y = this.dimensions.y - 50

            button.sprite = new Button(this, button);
        }
    }

    createCreditButton(){
        this.creditButton.sprite = new Button(this, this.creditButton);
    }

    muteSound = (boolean) => {
        this.rollover.setMute(boolean)
        this.click.setMute(boolean)
    }

}


