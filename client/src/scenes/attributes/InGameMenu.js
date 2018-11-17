import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import Button from '../../sprites/Button';

/**
 * @abstract
 */
export default class InGameMenu extends Scene {
    
    constructor() {
        super("InGameMenu");

    }

    dimensions = new Vector2(
        window.innerWidth,
        window.innerHeight
    );

    menuBackground;
    
    exit = ()=>{
        this.scene.run("MainMenu");
        this.scene.bringToTop("MainMenu")

        this.scene.remove("InGameMenu");
        this.scene.remove("LevelThree");
    }

    helloWorld = ()=>{
        console.log("hello world")
    }

    buttons = [
        {sprite: null, scale: 0.3, x: this.dimensions.x/2 - 100 , y: this.dimensions.y/2 + 130, texture: "backButton", callback: this.helloWorld },
        {sprite: null, scale: 0.3, x: this.dimensions.x/2 , y: this.dimensions.y/2 + 130, texture: "rankingButton", callback: this.helloWorld },
        {sprite: null, scale: 0.3, x: this.dimensions.x/2 + 100, y: this.dimensions.y/2 + 130, texture: "exitButton", callback: this.exit }
    ]

    createButtons(){
        for (const button of this.buttons) {
            button.sprite = new Button(this, button);
        }
    }

    preload() {   
        Button.preload(this)
        this.load.image('backgroundInGameMenu', 'assets/img/Menu/menuBackground.png');

        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')
    }


    create(){
        this.createBackground()
        this.createButtons()
    }


    createBackground(){
        this.menuBackground = this.add.image(this.dimensions.x/2, this.dimensions.y/2, 'backgroundInGameMenu')
        .setOrigin(0.5)
        .setScale(0.4);
    }
    

}


