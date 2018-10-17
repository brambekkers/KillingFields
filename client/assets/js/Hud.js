class Hud {
    constructor(scene) {
        this.scene = scene

        // CharInfo
        this.background = null
        this.char =  null 
        this.heartHealth = null
        this.killText= null

        // Itembox
        this.itemSlots = [
            {
                slot: null,
                x: null,
                y: null,
                item: null
            },
            {
                slot: null,
                x: null,
                y: null,
                item: null
            },
            {
                slot: null,
                x: null,
                y: null,
                item: null
            },
            {
                slot: null,
                x: null,
                y: null,
                item: null
            }
        ]

        this.itemGroup = this.scene.add.group()

        this.create()
    }


    static preload(scene){
        scene.load.image('voorbeeldHud', 'assets/img/HUD/voorbeeldHud.png');
        scene.load.image('hudAchtergrond', 'assets/img/HUD/hudAchtergrond.png');
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

        // font
        WebFont.load({
            google: {
                families: ['Knewave']
            },
            active: ()=>{
                this.killText.setFontFamily('Knewave');
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
        let slotAmount = this.itemSlots.length-1
        let slotHeight = slotAmount * 130
        let slotHeightHalf = slotHeight / 2

        let itemColor = 1

        for (const [index, itemSlot] of this.itemSlots.entries()) {
            itemSlot.x = this.scene.cameras.main.width - 80
            itemSlot.y = (this.scene.cameras.main.height/2 + slotHeightHalf) - (index*130)

            itemSlot.slot = this.createSprite(itemSlot.x, itemSlot.y, `dropBox${itemColor}`, 1).setOrigin(0.5, 0.5)

            if(itemColor <= 2){
                itemColor++
            }
        }

        this.updateItemBox()
    }

    updateItemBox(){
        for (const [num, itemSlot] of this.itemSlots.entries()) {
            if(player.items[num]){
                itemSlot.item = player.items[num]
            }else{
                itemSlot.item = null
            }
        }

        this.drawItems()
    }

    drawItems(){
        this.itemGroup.clear(true); 

        for (const  itemSlot of this.itemSlots){
            let newItem

            if(itemSlot.item === 'crate'){
                newItem =  this.scene.add.image(itemSlot.x, itemSlot.y, `crate2`)
            }
            if(itemSlot.item === 'spike'){
                newItem =  this.scene.add.image(itemSlot.x, itemSlot.y, `spike`)
            }
    
            if(itemSlot.item){
                newItem.setScrollFactor(0);
                this.itemGroup.add(newItem);
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