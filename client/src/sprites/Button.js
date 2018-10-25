import Sprite from './Sprite';

/**
 *
 */
export default class Button extends Sprite {
    /**
     *
     */

    constructor(scene, data) {
        super(scene, Object.assign(data));
        this.setScale(data.scale);
        this.setInteractive({ cursor: 'url(assets/img/Cursor/Pointer_Small.cur), pointer' });
        

        this.name = data.name
        this.text = null
        this.sounds = {
            click: null,
            rollover: null,
        };

        this.clickInteraction(data)
        this.addText(data)
        this.createSounds()
    }

    /**
     * Preloads the assets needed for this item.
     */
    static preload(scene) {

        // Different buttons
        scene.load.image('buttonBackground', 'assets/img/Menu/buttonBackground.png');
        scene.load.image('optionsButton', 'assets/img/Menu/button_options.png');
        scene.load.image('musicButton', 'assets/img/Menu/button_music.png');
        scene.load.image('muteMusicButton', 'assets/img/Menu/button_muteMusic.png');
        scene.load.image('soundButton', 'assets/img/Menu/button_sound.png');
        scene.load.image('muteSoundButton', 'assets/img/Menu/button_muteSound.png');
        scene.load.image('homeButton', 'assets/img/Menu/button_home.png');
        scene.load.image('backButton', 'assets/img/Menu/button_back.png');
        scene.load.image('rankingButton', 'assets/img/Menu/button_ranking.png');
        scene.load.image('exitButton', 'assets/img/Menu/button_exit.png');


        // Sound
        scene.load.audio('click', 'assets/audio/Click/click2.ogg');
        scene.load.audio('rollover', 'assets/audio/Click/rollover6.ogg');
    }


    clickInteraction(data){
        this.on('pointerover', (event) => {
            this.setTint(0xff0000);
            this.sounds.rollover.play();
            
        });
        this.on('pointerout', (event) => {
            this.clearTint();
        });
        this.on('pointerdown', (pointer) => {
            this.sounds.click.play();
            data.callback()
        });
    }

    addText(data){
        this.text = this.scene.add.text(this.x, this.y, data.name, {
            fontFamily: 'Nosifer',
            fontSize: 30,
            color: '#ffffff' ,
        })
        .setOrigin(0.5, 0.5)
        .setShadow(5, 5, "#000000", 5, true, true);
    }

    setFont(){
        this.text.setFontFamily('Knewave');    
    }

    createSounds(){
        this.sounds.click = this.scene.sound.add('click');
        this.sounds.rollover = this.scene.sound.add('rollover');
    }

    changeSoundButton(button, boolean){
        if(boolean){
            this.setTexture(button.textureOff)
        }else{
            this.setTexture(button.texture)
        }
    }

    muteClickSound(boolean){
        this.sounds.click.setMute(boolean);
        this.sounds.rollover.setMute(boolean);
    }


    /**
     *
     */
    destroy() {
        super.destroy();
    }
}
