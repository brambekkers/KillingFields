import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import { createContext } from 'vm';



/**
 * @abstract
 */
export default class Level extends Scene {

    dimensions = new Vector2(
        window.innerWidth,
        window.innerHeight
    );
    background;
    backgroundLogo;
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
    


    preload() {
        this.load.image('background', 'assets/img/background.png');
        this.load.image('buttonBackground', 'assets/img/Menu/buttonBackground.png');
        this.load.image('achtergrondLogo', 'assets/img/Menu/achtergrondlogo.png');
        this.load.image('music', 'assets/img/Menu/button_music.png');
        this.load.image('muteMusic', 'assets/img/Menu/button_muteMusic.png');
        this.load.image('sound', 'assets/img/Menu/button_sound.png');
        this.load.image('muteSound', 'assets/img/Menu/button_muteSound.png');
        
        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')
    }

    create(){
        this.cameras.main.setBounds(0, 0, this.dimensions.x, this.dimensions.y);
        this.createPointer();
        this.createBackground();
        this.createMenuButton()
        this.createSoundButton()


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
    }


    createBackground() {
        this.backgroundLogo = this.add.image(this.dimensions.x/2, 0, `achtergrondLogo`, 1).setOrigin(0.5, 0).setScale(0.9)
        
    }

    createMenuButton() {
        let buttonAmount = this.menuButtons.length - 1
        let buttonHeight = buttonAmount * 120
        let buttonHeightHalf = buttonHeight / 2

        for (const [index, button] of this.menuButtons.entries()) {
            button.x = this.dimensions.x / 2
            button.y = (this.dimensions.y / 1.7) + (index * 120) - buttonHeightHalf

            button.background = this.createButtonBackground(button);
            button.text = this.createButtonText(button);
        }
    }

    createButtonBackground(button){
        let buttonBackground = this.add.sprite(button.x, button.y, `buttonBackground`, 1).setOrigin(0.5, 0.5).setScale(0.35)

        // Mouse interaction
        this.setMousePointer(buttonBackground)

        buttonBackground.on('pointerover', function (event) {
            this.setTint(0xff0000);
        });
        buttonBackground.on('pointerout', function (event) {
            this.clearTint();
        });
        buttonBackground.on('pointerdown', function (pointer) {
            console.log(button.name)
        });


        return buttonBackground
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
        this.input.setDefaultCursor('url(assets/img/Cursor/Cursor2_Small.cur), pointer')

    }

    createSoundButton(){
        let buttonAmount = this.soundButtons.length - 1
        let buttonWidth = buttonAmount * 100

        for (const [index, button] of this.soundButtons.entries()) {
            button.x = this.dimensions.x - (index * 100)
            button.y = this.dimensions.y


            if(button.name === 'Sound'){
                button.background =this.add.sprite(button.x, button.y, `sound`, 1).setOrigin(1, 1).setScale(0.35)
            } 
            if(button.name === 'Music'){
                button.background =this.add.sprite(button.x, button.y, `music`, 1).setOrigin(1, 1).setScale(0.35)
            } 

            // Mouse interaction
            this.setMousePointer(button.background)
            button.background.on('pointerover', function (event) {
                this.setTint(0xff0000);
            });
            button.background.on('pointerout', function (event) {
                this.clearTint();
            });
            button.background.on('pointerdown', function (pointer, test) {
                console.log(pointer)
                console.log(test)
                button.isOn = !button.isOn

                // if(button.isOn && button.name === 'Sound'){
                //     button.background = this.add.sprite(button.x, button.y, `sound`, 1).setOrigin(1, 1).setScale(0.35)
                // }else{
                //     button.background = this.add.sprite(button.x, button.y, `muteSound`, 1).setOrigin(1, 1).setScale(0.35)
                // }
            });
        }
    }

    setMousePointer(sprite){
        sprite.setInteractive({ cursor: 'url(assets/img/Cursor/Pointer_Small.cur), pointer' });
      
    }
}


