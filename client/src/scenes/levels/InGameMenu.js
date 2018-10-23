import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import { createContext } from 'vm';


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
    


    preload() {   
        this.load.image('backgroundInGameMenu', 'assets/img/Menu/menuBackground.png');


        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')
    }

    create(){
        this.createBackground()

        // font
        WebFont.load({
            google: {
                families: ['Knewave']
            },
            active: ()=>{
               
            }
        }); 
    }


    createBackground(){
        this.menuBackground = this.add.image(this.dimensions.x/2, this.dimensions.y/2, 'backgroundInGameMenu').setOrigin(0.5).setScale(0.5);
    }
    

}


