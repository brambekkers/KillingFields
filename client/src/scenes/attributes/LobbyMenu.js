import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import Button from '../../sprites/Button';
const uniqid = require('uniqid');


/**
 * @abstract
 */
export default class LobbyMenu extends Scene {
    
    constructor() {
        super("LobbyMenu");

    }

    dimensions = new Vector2(
        window.innerWidth,
        window.innerHeight
    );

    menuBackground;
    
    newRoom = ()=>{
        let test = window.socket.emit('createRoom', uniqid());
        console.log(test)
    }
 
    back = ()=>{
        this.scene.stop("LobbyMenu")
        this.scene.run("MainMenu")
    }

    buttons = [
        {sprite: null, scale: 0.3, x: this.dimensions.x/2 - 230 , y: this.dimensions.y/2 + 370, texture: "backButton", callback: this.back },
        {sprite: null, name: "Create  New  Room ", scale: 0.3, x: this.dimensions.x/2 , y: this.dimensions.y/2 + 370, texture: "buttonBackground1", callback: this.newRoom },
    ]

    preload() {   
        Button.preload(this)
        this.load.image('backgroundLobbyMenu', 'assets/img/Menu/lobbyMenuBackground.png');

        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')
    }


    create(){
        this.createBackground()
        this.createButtons()

        // font
        WebFont.load({
            google: {
                families: ['Knewave']
            },
            active: ()=>{
                for (const button of this.buttons) {
                    button.sprite.setFont();    
                }
            }
        });
    }

    createButtons(){
        for (const button of this.buttons) {
            button.sprite = new Button(this, button);
        }
    }



    createBackground(){
        this.menuBackground = this.add.image(this.dimensions.x/2, this.dimensions.y/2, 'backgroundLobbyMenu')
        .setOrigin(0.5)
        .setScale(0.3);
    }
    

}


