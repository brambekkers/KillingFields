import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import Button from '../../sprites/Button';

/**
 * @abstract
 */
export default class Credits extends Scene {

    constructor() {
        super("Credits");

    }

    dimensions = new Vector2(
        window.innerWidth,
        window.innerHeight
    );

    Background;
    ThijsAndBram
    backgroundMusic
    light;
    ship1;
    ship2;
    path1;
    path2;
    texts = [null, null,null,null,null,null,null,null,null,null]


    preload() {
        this.load.image('backgroundMainMenu', 'assets/img/backgroundMainMenu.png');
        this.load.image('achtergrondLogo', 'assets/img/Menu/achtergrondlogo.png');
        this.load.image('ThijsAndBram', 'assets/img/Menu/ThijsAndBramWaving.png');
        this.load.image('ship1', 'assets/img/Player/ship1.png');
        this.load.image('ship2', 'assets/img/Player/ship2.png');

        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

        // Audio
        this.load.audio('creditMusic', 'assets/audio/Music/credits.ogg');
    }


    create() {
        this.createBackground();
        this.createPaths();
        this.createText();
        this.makePathsVisible(false);
        this.annimation();
       
        this.backgroundMusic = this.sound.add('creditMusic');
        this.backgroundMusic.play();

        // font
        WebFont.load({
            google: {
                families: ['Knewave']
            },
            active: () => {
                for (const text of this.texts) {
                    text.setFontFamily('Knewave');
                }
            }
        });

        this.lights.enable().setAmbientColor(0x555555);
        this.light  = this.lights.addLight(0, 0, 200).setScrollFactor(0.0).setIntensity(2);

        this.lights.addLight(0, 100, 100).setColor(0xff0000).setIntensity(3.0);
        this.lights.addLight(0, 200, 100).setColor(0x00ff00).setIntensity(3.0);
        this.lights.addLight(0, 300, 100).setColor(0x0000ff).setIntensity(3.0);
        this.lights.addLight(0, 400, 100).setColor(0xffff00).setIntensity(3.0);
    }

    createBackground() {
        this.background = this.add.image(0, 0, 'backgroundMainMenu').setOrigin(0).setDisplaySize(this.dimensions.x, this.dimensions.y);
    }

    createText() {
        for (let i = 0; i < 4; i++) {
            this.texts[i] = this.add.text(this.dimensions.x / 2, this.dimensions.y / 2, '', {
                    fontFamily: 'Freckle Face',
                    fontSize: 150,
                    color: '#ffffff'
                })
                .setShadow(2, 2, "#333333", 2, false, true)
                .setOrigin(0.5);
        }
        for (let i = 4; i < 10; i++) {
            this.texts[i] = this.add.text(this.dimensions.x / 2, this.dimensions.y / 2, '', {
                    fontFamily: 'Freckle Face',
                    fontSize: 70,
                    color: '#ffffff'
                })
                .setShadow(2, 2, "#333333", 2, false, true)
                .setOrigin(0.5);
        }
    }

    createPaths() {
        // Path 1
        this.path1 = new Phaser.Curves.Path(-100, -100);

        this.path1.splineTo([
            // point 1
            0, 0,
            // point 2
            this.dimensions.x / 7, this.dimensions.y / 8,
            // point 3
            this.dimensions.x / 6, this.dimensions.y / 4,
            // point 4
            this.dimensions.x / 3.5, this.dimensions.y / 3,
            // point 5
            this.dimensions.x / 3, this.dimensions.y / 2,
            // point 5
            this.dimensions.x / 2, this.dimensions.y / 2
        ]);

        // Path 2
        this.path2 = new Phaser.Curves.Path(this.dimensions.x + 100, -100);

        this.path2.splineTo([
            // point 1
            this.dimensions.x, 0,
            // point 2
            this.dimensions.x / 5, this.dimensions.y / 5,
            // point 3
            this.dimensions.x / 5, this.dimensions.y / 1.4,
            // point 4
            this.dimensions.x / 1.1, this.dimensions.y / 1.4,
            // point 5
            this.dimensions.x / 1.2, this.dimensions.y / 8,
            // point 5
            this.dimensions.x / 2, this.dimensions.y / 2
        ]);
    }

    makePathsVisible(x) {
        if (x) {
            let graphics = this.add.graphics();
            graphics.lineStyle(1, 0xffffff, 1);
            this.path1.draw(graphics, 128);
            this.path2.draw(graphics, 128);
        }
    }

    annimation() {
        this.introText().then(() => {
            return this.ship2Movement();
        }).then(() => {
            return this.ship1Movement()
        }).then(() => {
            return this.wait1Second()
        }).then(() => {
            return this.ThijsAndBram()
        }).then(() => {
            return this.wait1Second()
        }).then(() => {
            return this.logo()
        }).then(() => {
            this.cameraFade()
        }).then(() => {
            return this.wait1Second()
        }).then(() => {
            this.exitCredits()
        })
    }

    introText(){
        return new Promise((resolve, reject) => {
            this.textTimeout(this.texts[6], "Ladies and Gentlemen ", 2000, 3000)
            this.textTimeout(this.texts[7], "We proudly present to you ", 6000, 2000)
            this.textTimeout(this.texts[8], "A production of ", 10000, 3000)
            this.textTimeout(this.texts[9], "NOBODY... ", 16000, 2000)
            setTimeout(()=>{
                resolve();
            },17000)
        });
    }

    ship2Movement() {
        return new Promise((resolve, reject) => {
            let annimation = this.add.follower(this.path2, this.dimensions.x + 100, -100, 'ship2');

            annimation.startFollow({
                duration: 12000,
                yoyo: false,
                repeat: 0,
                rotateToPath: false,
                verticalAdjust: true,
                onComplete: () => {
                    this.animComplete(annimation)
                    resolve()
                },
            });

            // Text: Thijs Daniels
            this.textTimeout(this.texts[0], "Thijs ", 3000, 2000)
            this.textTimeout(this.texts[1], "Daniels ", 8000, 2000)
        });
    }

    wait1Second(){
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve()
            },1000)
        });
    }

    ship1Movement() {
        return new Promise((resolve, reject) => {
            let annimation = this.add.follower(this.path1, -100, -100, 'ship1');

            annimation.startFollow({
                duration: 10000,
                yoyo: false,
                repeat: 0,
                rotateToPath: true,
                verticalAdjust: true,
                onComplete: () => {
                    this.animComplete(annimation)
                    resolve()
                },
            });

            // Text: Bram Bekkers
            this.textTimeout(this.texts[2], "Bram ", 3000, 2000)
            this.textTimeout(this.texts[3], "Bekkers ", 6000, 2000)
        });
    }

    textTimeout(text, string, start, end) {
        setTimeout(() => {
            text.setText(string)
            setTimeout(() => {
                this.animComplete(text)
            }, end)
        }, start)
    }

    cameraFade() {
        return new Promise((resolve, reject) => {
            this.cameras.main.fade(2000)
            
            setTimeout(() => {
                resolve()
            }, 3000)
        });
    }


    ThijsAndBram() {
        return new Promise((resolve, reject) => {
            this.ThijsAndBram = this.add.image(this.dimensions.x / 2, this.dimensions.y / 2, `ThijsAndBram`).setOrigin(0.5).setScale(2)
            setTimeout(() => {
                this.animComplete(this.ThijsAndBram)
                resolve()
            }, 5000)

            // Text: Bram Bekkers
            this.texts[4].setY(this.dimensions.y /2 - 170 )
            this.texts[5].setY(this.dimensions.y /2 + 170 )
            this.textTimeout(this.texts[4], "Thijs en Bram ", 500, 3500)
            this.textTimeout(this.texts[5], "Amsterdam 2019 ", 1000, 3000)
        });
    }


    logo() {
        return new Promise((resolve, reject) => {
            this.backgroundLogo = this.add.image(this.dimensions.x / 2, this.dimensions.y / 2, `achtergrondLogo`).setOrigin(0.5).setScale(0.7)
            setTimeout(() => {
                resolve()
            }, 5000)
        });
    }


    animComplete(animation) {
        //  Animation is over, let's fade the sprite out
        this.tweens.add({
            targets: animation,
            duration: 1000,
            alpha: 0
        });
    }

    exitCredits(){
        this.scene.start("MainMenu");
        
        this.backgroundMusic.stop();
        this.scene.remove("Credits")
    }

}