import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import Button from '../../sprites/Button';
import { createContext } from 'vm';


/**
 * @abstract
 */
export default class MainMenu extends Scene {
    
    constructor() {
        super("MainMenu");

    }

    dimensions = new Vector2(
        window.innerWidth,
        window.innerHeight
    );
    background;
    backgroundLogo;
    cursor;
    menuButtons = [
        {sprite: null, name: "Quick play ", x:0, y:0, texture: "buttonBackground", scale:0.3, callback: ()=>{ console.log("Clicked on Quickplay")} },
        {sprite: null, name: "Lobby ", x:0, y:0, texture: "buttonBackground", scale:0.3, callback: ()=>{ console.log("Clicked on Lobby")} },
        {sprite: null, name: "Options ", x:0, y:0, texture: "buttonBackground", scale:0.3, callback: ()=>{ console.log("Clicked on Options")} },
        {sprite: null, name: "Exit ", x:0, y:0, texture: "buttonBackground", scale:0.3, callback: ()=>{ console.log("Clicked on Exit")} },

    ];
    soundButtons = [
        {sprite: null, scale: 0.3, x:0, y:0, texture: "musicButton", isOn: true, callback: ()=>{ console.log("Clicked on Sound button")} },
        {sprite: null, scale: 0.3, x:0, y:0, texture: "soundButton", isOn: true, callback: ()=>{ console.log("Clicked on Music button")} },
    ]
    backgroundMusic = null
   


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

    createMusic(){
        this.backgroundMusic = this.sound.add('backgroundMusic');
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


    ExitMainMenu(){
        this.backgroundMusic.stop();

        this.scene.sleep()
        this.startGame()
    }

    startGame(){
        this.scene.launch("LevelTwo");
        this.scene.launch("InGameMenu");
        this.scene.bringToTop("InGameMenu")
        this.scene.sleep("InGameMenu")
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





            // // Mouse interaction
  
            // button.background.on('pointerdown', (pointer) => {

            //     button.isOn = !button.isOn;
            //

            //     // Sound button
            //     if(button.isOn && button.name === 'Sound'){
            //         button.background = this.add.sprite(button.x, button.y, `sound`).setOrigin(1, 1).setScale(0.35)
            //         this.muteSound(false)
                    
            //     }else if(!button.isOn && button.name === 'Sound'){
            //         button.background = this.add.sprite(button.x, button.y, `muteSound`).setOrigin(1, 1).setScale(0.35)
            //         this.muteSound(true)
            //     }

            //     // Music button
            //     if(button.isOn && button.name === 'Music'){
            //         button.background = this.add.sprite(button.x, button.y, `music`).setOrigin(1, 1).setScale(0.35)
            //         this.muteMusic(false)
            //     }else if(!button.isOn && button.name === 'Music'){
            //         button.background = this.add.sprite(button.x, button.y, `muteMusic`).setOrigin(1, 1).setScale(0.35)
            //         this.muteMusic(true)                
            //     }
            // });
        }
    }

    setMousePointer(sprite){
        sprite.setInteractive({ cursor: 'url(assets/img/Cursor/Pointer_Small.cur), pointer' });
    }

    muteSound(boolean){
        // this.rollover.setMute(boolean)
        // this.click.setMute(boolean)
    }
    muteMusic(boolean){
        this.backgroundMusic.setMute(boolean);
    }
}


