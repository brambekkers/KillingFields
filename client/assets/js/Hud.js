class Hud {
    constructor(scene) {
        this.scene = scene

        // CharInfo
        this.background = null
        this.char =  null 
        this.heartHealth = null
        this.killText= null

        // Itembox
        this.box1 = null
        this.box2 = null
        this.box3 = null

        this.itemGroup = this.scene.add.group()

        this.create()
    }


    static preload(scene){
        scene.load.image('voorbeeldHud', 'assets/img/HUD/voorbeeldHud.png');
        scene.load.image('hudAchtergrond', 'assets/img/HUD/hudAchtergrond.png');
        scene.load.image('item_crate', 'assets/img/Tiles/box.png');
        scene.load.spritesheet('heartHealth', 'assets/img/HUD/hudHealth/heartSpritesheet.png', { frameWidth: 53, frameHeight: 45});

        // Fonts
        scene.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

        for (let i = 1; i <= 3; i++) {
            scene.load.image(`hudPlayer${i}`, `assets/img/HUD/hud${i}/hudSquare.png`);    
            scene.load.image(`dropBox${i}`, `assets/img/HUD/dropBox${i}.png`);    
        }
    }

    create(){
        this.createCharInfo()
        this.createItemBox({
            
        })

        let _this = this
        // font
        WebFont.load({
            google: {
                families: ['Knewave']
            },
            active: function (){
                _this.killText.setFontFamily('Knewave');
            }
        });
    }

    createCharInfo(){
        this.background = this.createSprite(0, 0, 'hudAchtergrond', 1)
        this.char = this.createSprite(50, 50, `hudPlayer${player.characterNum}`, 0.9)
        this.heartHealth = this.createSprite(128, 45, 'heartHealth', 0.8)
        this.heartHealth.anims.play(`heartHealth10`);

        this.killText = this.scene.add.text(230, 97, player.kills, { 
            fontFamily: 'Nosifer', 
            fontSize: 14, 
            color: '#ffffff' ,
            border: '#000000',
        }).setOrigin(1, 0);
        this.killText.setStroke('#000000', 5)
        this.killText.setScrollFactor(0);
    }
    
    createItemBox(){
        this.box3 = this.createSprite(this.scene.cameras.main.width - 80, this.scene.cameras.main.height/2-130, `dropBox3`, 1).setOrigin(0.5, 0.5)
        this.box2 = this.createSprite(this.scene.cameras.main.width - 80, this.scene.cameras.main.height/2, `dropBox2`, 1).setOrigin(0.5, 0.5)
        this.box1 = this.createSprite(this.scene.cameras.main.width - 80, this.scene.cameras.main.height/2+130, `dropBox1`, 1).setOrigin(0.5, 0.5)

        this.updateItemBox()
    }

    updateItemBox(){
        this.itemGroup.clear(true); 

        for (const [num, item] of player.items.entries()) {
            let dist
            if(num == 2){
                dist = -130
            }else if(num == 1){
                dist = 0
            }else if(num == 0){
                dist = 130
            }

            if(item === 'crate'){
                let crate =  this.scene.add.image(this.scene.cameras.main.width - 80, this.scene.cameras.main.height/2 + dist, `item_crate`).setScrollFactor(0);
                this.itemGroup.add(crate);
            }
        }
    }

    createSprite(x, y, spriteName, scale){
        let sprite = this.scene.add.sprite(x, y, spriteName).setOrigin(0, 0);
        sprite.setScrollFactor(0);
        sprite.setScale(scale)

        return sprite
    }
}