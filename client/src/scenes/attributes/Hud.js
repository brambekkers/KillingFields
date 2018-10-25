import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import Button from '../../sprites/Button';


/**
 *
 */
export default class Hud extends Scene {
    constructor() {
        super("Hud");   
    }
    
    itemGroup 
    player;
    charInfo = {
        background: null,
        char: null,
        heartHealth: null,
        killText: null
    }


    openMenu = ()=>{
        console.log(this)
        this.scene.launch("InGameMenu");
        this.scene.bringToTop("InGameMenu")
    }

    optionButton = {sprite: null, scale: 0.2, x:60, y:150, texture: "optionsButton", callback: this.openMenu }

    // Itembox
    itemSlots = [
        {
            slot: null,
            x: null,
            y: null,
            Item: null
        },
        {
            slot: null,
            x: null,
            y: null,
            Item: null
        },
        {
            slot: null,
            x: null,
            y: null,
            Item: null
        }
    ]

    dimensions = new Vector2(
        window.innerWidth,
        window.innerHeight
    );

    preload() {
        Button.preload(this)

        this.load.image('hudAchtergrond', 'assets/img/HUD/hudAchtergrond.png');
        this.load.spritesheet('heartHealth', 'assets/img/HUD/hudHealth/heartSpritesheet.png', { frameWidth: 53, frameHeight: 45});

        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

        for (let i = 1; i <= 5; i++) {
            this.load.image(`hud_player${i}`, `assets/img/HUD/hud${i}/hudSquare.png`);
        }
        for (let i = 1; i <= 3; i++) {
            this.load.image(`dropBox${i}`, `assets/img/HUD/dropBox${i}.png`);
        }
    }


    create() {
        this.itemGroup = this.add.group()
        this.createAnimations()
        this.createCharInfoBox()
        this.createItemBox()

        // font
        WebFont.load({
            google: {
                families: ['Knewave']
            }
        });
    }

    setPlayerData(player){
        this.player = player

        this.createChar()
        this.createKillText()
        this.setFont()
        this.updateItemBox()
    }


    createAnimations() {
        for (let i = 0; i <= 11; i++) {
            this.anims.create({
                key: `heartHealth${i}`,
                frames: this.anims.generateFrameNumbers('heartHealth', { start: `${i}`, end: `${i}`}),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    createCharInfoBox() {
        this.charInfo.background = this.createSprite(0, 0, 'hudAchtergrond', 1)
        this.optionButton.sprite = new Button(this, this.optionButton);
        this.charInfo.heartHealth = this.createSprite(128, 45, 'heartHealth', 0.8)
        this.charInfo.heartHealth.anims.play(`heartHealth10`);
    }

    createChar(){
        this.charInfo.char = this.createSprite(50, 50, `hud_${this.player.character}`, 0.9)
    }

    createKillText(){
        this.charInfo.killText = this.add.text(230, 97, this.player.kills, {
            fontFamily: 'Nosifer',
            fontSize: 14,
            color: '#ffffff' ,
            border: '#000000',
        }).setOrigin(1, 0);
        this.charInfo.killText.setStroke('#000000', 5)
        this.charInfo.killText.setScrollFactor(0);
    }

    setFont(){
        this.charInfo.killText.setFontFamily('Knewave');

    }

    createItemBox() {
        let slotAmount = this.itemSlots.length - 1
        let slotHeight = slotAmount * 130
        let slotHeightHalf = slotHeight / 2

        let itemColor = 1

        for (const [index, itemSlot] of this.itemSlots.entries()) {
            itemSlot.x = this.dimensions.x - 80
            itemSlot.y = (this.dimensions.y / 2 + slotHeightHalf) - (index * 130)

            itemSlot.slot = this.createSprite(itemSlot.x, itemSlot.y, `dropBox${itemColor}`, 1).setOrigin(0.5, 0.5)

            if (itemColor <= 2) {
                itemColor++
            }
        }
    }

    updateItemBox() {
        for (const [i, itemSlot] of this.itemSlots.entries()) {
            if (this.player.secondaryItems[i]) {
                itemSlot.Item = this.player.secondaryItems[i]
            } else {
                itemSlot.Item = null
            }
        }
        this.drawItems()
    }

    drawItems() {
        this.itemGroup.clear(true);

        for (const itemSlot of this.itemSlots) {
            if (!itemSlot.Item) {
                continue;
            }

            const icon = this.add.image(itemSlot.x, itemSlot.y, itemSlot.Item.icon);
            icon.setScrollFactor(0);
            this.itemGroup.add(icon);
        }
    }

    createSprite(x, y, spriteName, scale) {
        let sprite = this.add.sprite(x, y, spriteName).setOrigin(0, 0);
        sprite.setScrollFactor(0);
        sprite.setScale(scale)

        return sprite
    }
}
