import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import Button from '../../sprites/Button';


/**
 *
 */

export default class Hud extends Scene {
    itemGroup;
    player;
    charInfo = {
        background: null,
        char: null,
        heartHealth: null,
        killText: null
    }

    /**
     *
     */
    constructor(player) {
        super("Hud");
        this.player = player
    }



    openMenu = () => {
        this.scene.start("InGameMenu");
        this.scene.bringToTop("InGameMenu")
    }

    optionButton = {
        sprite: null,
        scale: 0.2,
        x: 60,
        y: 150,
        texture: "optionsButton",
        callback: this.openMenu
    }

    // Itembox
    itemSlots = [{
            slot: null,
            x: null,
            y: null,
            item: null,
        },
        {
            slot: null,
            x: null,
            y: null,
            item: null,
        },
        {
            slot: null,
            x: null,
            y: null,
            item: null,
        }
    ]

    dimensions = new Vector2(
        window.innerWidth,
        window.innerHeight
    );

    preload() {
        Button.preload(this)

        this.load.image('hudAchtergrond', 'assets/img/HUD/hudAchtergrond.png');
        this.load.spritesheet('heartHealth', 'assets/img/HUD/hudHealth/heartSpritesheet.png', {
            frameWidth: 53,
            frameHeight: 45
        });

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
        this.createKillText()


        // font
        WebFont.load({
            google: {
                families: ['Knewave']
            },
            active: ()=>{
               this.setFont()
            }
        });
    }

    update(){
        if(this.player){
            this.createChar()
            this.updateItemBox()
            this.updateKillText()
            this.updateHeartHealth()
        }
    }

    updateHeartHealth(){
        this.charInfo.heartHealth.play(`heartHealth${this.player.health}`, true);
    }

    setPlayerData(player){
        this.player = player
    }

    createAnimations() {
        for (let i = 0; i <= 11; i++) {
            this.anims.create({
                key: `heartHealth${i}`,
                frames: this.anims.generateFrameNumbers('heartHealth', {
                    start: `${i}`,
                    end: `${i}`
                }),
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

    createChar() {
        this.charInfo.char = this.createSprite(50, 50, `hud_${this.player.character}`, 0.9)
    }

    createKillText() {
        this.charInfo.killText = this.add.text(230, 97, ' ', {
            fontFamily: 'Nosifer',
            fontSize: 14,
            color: '#ffffff',
            border: '#000000',
        }).setOrigin(1, 0);
        this.charInfo.killText.setStroke('#000000', 5)
        this.charInfo.killText.setScrollFactor(0);
    }

    updateKillText(){
        this.charInfo.killText.setText(this.player.kills)
    }

    setFont() {
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
                itemSlot.item = this.player.secondaryItems[i].object
            } else {
                itemSlot.item = null
            }
        }
        this.drawItems()
    }

    drawItems() {
        this.itemGroup.clear(true);


        for (const [i, itemSlot] of this.itemSlots.entries()) {
            if (!itemSlot.item) {
                continue;
            }
            const icon = this.add.image(itemSlot.x, itemSlot.y, itemSlot.item.icon);
            icon.setScrollFactor(0);
            this.itemGroup.add(icon);

            const text = this.drawItemAmount(itemSlot.x, itemSlot.y, `${this.player.secondaryItems[i].amount} `)
            this.itemGroup.add(text);

        }
    }

    drawItemAmount(x, y, amount) {
        let text = this.add.text(x + 15, y + 5, amount, {
                fontFamily: 'Knewave',
                fontSize: 20,
                color: '#ffffff',
                border: '#000000',
            })
            .setStroke('#000000', 5)
            .setScrollFactor(0);

        return text
    }

    createSprite(x, y, spriteName, scale) {
        let sprite = this.add.sprite(x, y, spriteName).setOrigin(0, 0);
        sprite.setScrollFactor(0);
        sprite.setScale(scale)

        return sprite
    }
}