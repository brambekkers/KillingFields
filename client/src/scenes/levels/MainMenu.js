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
    background
    buttons = [
        {name: "Quick play ",    x:0, y:0, background: null, text: null},
        {name: "Lobby ",         x:0, y:0, background: null, text: null},
        {name: "Options ",       x:0, y:0, background: null, text: null},
        {name: "Exit ",          x:0, y:0, background: null, text: null},
    ]
    


    preload() {
        this.load.image('background', 'assets/img/background.png');
        this.load.image('buttonBackground', 'assets/img/Menu/buttonBackground.png');
     
        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')
    }

    create(){
        this.cameras.main.setBounds(0, 0, this.dimensions.x, this.dimensions.y);
        this.createPointer();
        this.createBackground();
        this.createButtonBackground()


        // font
        WebFont.load({
            google: {
                families: ['Knewave']
            },
            active: ()=>{
                for (const button of this.buttons) {
                    button.text.setFontFamily('Knewave');    
                }
            }
        });
    }


    createBackground() {
        this.background = this.add
            .tileSprite(
                this.dimensions.x / 2,
                this.dimensions.y / 2,
                this.dimensions.x,
                this.dimensions.y,
                'background'
            )
            .setScrollFactor(0);
    }

    createButtonBackground() {
        let buttonAmount = this.buttons.length - 1
        let buttonHeight = buttonAmount * 160
        let buttonHeightHalf = buttonHeight / 2

        for (const [index, button] of this.buttons.entries()) {
            button.x = this.dimensions.x / 2
            button.y = (this.dimensions.y / 2 - buttonHeightHalf) + (index * 160)

            button.background = this.add.image(button.x, button.y, `buttonBackground`, 1).setOrigin(0.5, 0.5).setScale(0.5)
            button.background.setInteractive({ cursor: 'url(assets/img/Cursor/Pointer_Small.cur), pointer' });
            button.text = this.createText(button.x, button.y, button.name)
            button.text.setShadow(5, 5, "#000000", 5, true, true);
        }
    }

    createText(x,y,name){
        return this.add.text(x, y, name, {
            fontFamily: 'Nosifer',
            fontSize: 60,
            color: '#ffffff' ,
            // border: '#000000',
        }).setOrigin(0.5, 0.5);
    }

    createPointer(){
        this.input.setDefaultCursor('url(assets/img/Cursor/Cursor2_Small.cur), pointer')

    }
}
