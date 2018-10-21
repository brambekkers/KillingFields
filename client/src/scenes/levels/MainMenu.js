import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import { createContext } from 'vm';

// import levelTwo from 'levelTwo';




/**
 * @abstract
 */
export default class Level extends Scene {
    
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
        {name: "Quick play ",    x:0, y:0, background: null, text: null},
        {name: "Lobby ",         x:0, y:0, background: null, text: null},
        {name: "Options ",       x:0, y:0, background: null, text: null},
        {name: "Exit ",          x:0, y:0, background: null, text: null},
    ];
    soundButtons = [
        {name: "Sound", x:0, y:0, background: null, isOn: true},
        {name: "Music", x:0, y:0, background: null, isOn: true},
    ]
    sounds = {
        backgroundMusic: null,
        click: null,
        rollover: null,
    };
    


    preload() {
        this.load.image('backgroundMainMenu', 'assets/img/backgroundMainMenu.png');
        this.load.image('buttonBackground', 'assets/img/Menu/buttonBackground.png');
        this.load.image('achtergrondLogo', 'assets/img/Menu/achtergrondlogo.png');
        this.load.image('music', 'assets/img/Menu/button_music.png');
        this.load.image('muteMusic', 'assets/img/Menu/button_muteMusic.png');
        this.load.image('sound', 'assets/img/Menu/button_sound.png');
        this.load.image('muteSound', 'assets/img/Menu/button_muteSound.png');

        // Audio
        this.load.audio('click', 'assets/audio/Click/click2.ogg');
        this.load.audio('rollover', 'assets/audio/Click/rollover6.ogg');
        this.load.audio('backgroundMusic', 'assets/audio/Music/background7.ogg');
       
        
        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')
    }

    create(){
        this.cameras.main.setBounds(0, 0, this.dimensions.x, this.dimensions.y);
        this.createPointer();
        this.createBackground();
        this.createMenuButton();
        this.createSoundButton();
        this.createSounds();


        // font
        WebFont.load({
            google: {
                families: ['Knewave']
            },
            active: ()=>{
                for (const button of this.menuButtons) {
                    button.text.setFontFamily('Knewave');    
                }
            }
        });

        this.sounds.backgroundMusic.play();
        this.sounds.backgroundMusic.setLoop(true);
    }

    createSounds(){
        this.sounds.backgroundMusic = this.sound.add('backgroundMusic');
        this.sounds.click = this.sound.add('click');
        this.sounds.rollover = this.sound.add('rollover');
    }


    createBackground() {
        this.background = this.add.image(0, 0, 'backgroundMainMenu').setOrigin(0).setDisplaySize(this.dimensions.x, this.dimensions.y);
        this.backgroundLogo = this.add.image(this.dimensions.x/2, 0, `achtergrondLogo`).setOrigin(0.5, 0).setScale(0.9)

    }

    createMenuButton() {
        let buttonAmount = this.menuButtons.length - 1
        let buttonHeight = buttonAmount * 120
        let buttonHeightHalf = buttonHeight / 2

        for (const [index, button] of this.menuButtons.entries()) {
            button.x = this.dimensions.x / 2
            button.y = (this.dimensions.y / 1.7) + (index * 120) - buttonHeightHalf

            button.background = this.createButtonBackground(this, button);
            button.text = this.createButtonText(button);
        }
    }

    resize (width, height){
        if (width === undefined) { width = this.sys.game.config.width; }
        if (height === undefined) { height = this.sys.game.config.height; }


        this.logo.setPosition(width / 2, height / 2);
    }

    createButtonBackground(scene, button){
        let buttonBackground = this.add.sprite(button.x, button.y, `buttonBackground`).setOrigin(0.5, 0.5).setScale(0.35)

        // Mouse interaction
        this.setMousePointer(buttonBackground)

        buttonBackground.on('pointerover', (event) => {
            buttonBackground.setTint(0xff0000);
            this.sounds.rollover.play();
        });
        buttonBackground.on('pointerout', (event) => {
            buttonBackground.clearTint();
        });
        buttonBackground.on('pointerdown', (pointer) => {
            this.sounds.click.play();
            console.log("Clicked on: ", button.name)

            this.ExitMainMenu()
            this.scene.launch("LevelTwo");
            this.scene.bringToTop("MainMenu")

        });
        return buttonBackground
    }

    ExitMainMenu(){
        this.sounds.backgroundMusic.stop();

        this.scene.sleep()

    }

    createButtonText(button){
        let text = this.add.text(button.x, button.y, button.name, {
            fontFamily: 'Nosifer',
            fontSize: 40,
            color: '#ffffff' ,
        }).setOrigin(0.5, 0.5);

        text.setShadow(5, 5, "#000000", 5, true, true);

        return text
    }

    createPointer(){
        this.cursor = this.input.setDefaultCursor('url(assets/img/Cursor/Cursor2_Small.cur), pointer')

    }

    createSoundButton(){
        let buttonAmount = this.soundButtons.length - 1
        let buttonWidth = buttonAmount * 100

        for (const [index, button] of this.soundButtons.entries()) {
            button.x = this.dimensions.x - (index * 100)
            button.y = this.dimensions.y

            // load sprite
            if(button.name === 'Sound'){
                button.background = this.add.sprite(button.x, button.y, `sound`).setOrigin(1, 1).setScale(0.35)
            } 
            if(button.name === 'Music'){
                button.background = this.add.sprite(button.x, button.y, `music`).setOrigin(1, 1).setScale(0.35)
            } 

            // Mouse interaction
            this.setMousePointer(button.background)
            button.background.on('pointerover', (event) => {
                button.background.setTint(0xff0000);
                this.sounds.rollover.play();
            });
            button.background.on('pointerout', (event) => {
                button.background.clearTint();
            });
            button.background.on('pointerdown', (pointer) => {

                button.isOn = !button.isOn;
                this.sounds.click.play();

                // Sound button
                if(button.isOn && button.name === 'Sound'){
                    button.background = this.add.sprite(button.x, button.y, `sound`).setOrigin(1, 1).setScale(0.35)
                    this.muteSound(false)
                    
                }else if(!button.isOn && button.name === 'Sound'){
                    button.background = this.add.sprite(button.x, button.y, `muteSound`).setOrigin(1, 1).setScale(0.35)
                    this.muteSound(true)
                }

                // Music button
                if(button.isOn && button.name === 'Music'){
                    button.background = this.add.sprite(button.x, button.y, `music`).setOrigin(1, 1).setScale(0.35)
                    this.muteMusic(false)
                }else if(!button.isOn && button.name === 'Music'){
                    button.background = this.add.sprite(button.x, button.y, `muteMusic`).setOrigin(1, 1).setScale(0.35)
                    this.muteMusic(true)                
                }
            });
        }
    }

    setMousePointer(sprite){
        sprite.setInteractive({ cursor: 'url(assets/img/Cursor/Pointer_Small.cur), pointer' });
      
    }

    muteSound(boolean){
        this.sounds.rollover.setMute(boolean)
        this.sounds.click.setMute(boolean)
    }
    muteMusic(boolean){
        console.log(this.sounds.backgroundMusic)
        this.sounds.backgroundMusic.setMute(boolean);
    }
}


