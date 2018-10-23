export default class Hud {
    constructor(player) {
        this.player = player;

        // CharInfo
        this.background = null
        this.optionButton = null
        this.char =  null
        this.heartHealth = null
        this.killText= null
        this.cursor = null

        // Itembox
        this.itemSlots = [
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
            },
            {
                slot: null,
                x: null,
                y: null,
                Item: null
            }
        ]

        this.itemGroup = this.player.scene.add.group()

        this.create()
    }


    static preload(scene) {
        scene.load.image('hudAchtergrond', 'assets/img/HUD/hudAchtergrond.png');
        scene.load.image('optionsButton', 'assets/img/Menu/button_options.png');

        scene.load.spritesheet('heartHealth', 'assets/img/HUD/hudHealth/heartSpritesheet.png', { frameWidth: 53, frameHeight: 45});

        // Fonts
        scene.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

        for (let i = 1; i <= 5; i++) {
            scene.load.image(`hud_player${i}`, `assets/img/HUD/hud${i}/hudSquare.png`);
        }
        for (let i = 1; i <= 3; i++) {
            scene.load.image(`dropBox${i}`, `assets/img/HUD/dropBox${i}.png`);
        }
    }

    static createAnimations(scene) {
        for (let i = 0; i <= 11; i++) {
            scene.anims.create({
                key: `heartHealth${i}`,
                frames: scene.anims.generateFrameNumbers('heartHealth', { start: `${i}`, end: `${i}`}),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    create() {
        this.createCharInfo()
        this.createItemBox()

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

    createCharInfo() {
        this.background = this.createSprite(0, 0, 'hudAchtergrond', 1)
        this.char = this.createSprite(50, 50, `hud_${this.player.character}`, 0.9)
        this.createOptionsButton()
        
        this.heartHealth = this.createSprite(128, 45, 'heartHealth', 0.8)
        this.heartHealth.anims.play(`heartHealth10`);

        this.killText = this.player.scene.add.text(230, 97, this.player.kills, {
            fontFamily: 'Nosifer',
            fontSize: 14,
            color: '#ffffff' ,
            border: '#000000',
        }).setOrigin(1, 0);
        this.killText.setStroke('#000000', 5)
        this.killText.setScrollFactor(0);
    }

    createOptionsButton(){
        this.optionButton = this.createSprite(40, 120, 'optionsButton', 0.2)
        console.log("button gemaakt")

        this.optionButton.on('pointerover', (event) => {
            this.optionButton.setTint(0xff0000);

        });
        this.optionButton.on('pointerout', (event) => {
            this.optionButton.clearTint();

        });
        this.optionButton.on('pointerdown', (pointer) => {

        });
    }


    createItemBox() {
        let slotAmount = this.itemSlots.length - 1
        let slotHeight = slotAmount * 130
        let slotHeightHalf = slotHeight / 2

        let itemColor = 1

        for (const [index, itemSlot] of this.itemSlots.entries()) {
            itemSlot.x = this.player.scene.cameras.main.width - 80
            itemSlot.y = (this.player.scene.cameras.main.height / 2 + slotHeightHalf) - (index * 130)

            itemSlot.slot = this.createSprite(itemSlot.x, itemSlot.y, `dropBox${itemColor}`, 1).setOrigin(0.5, 0.5)

            if (itemColor <= 2) {
                itemColor++
            }
        }

        this.updateItemBox()
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

            const icon = this.player.scene.add.image(itemSlot.x, itemSlot.y, itemSlot.Item.icon);
            icon.setScrollFactor(0);
            this.itemGroup.add(icon);
        }
    }

    createSprite(x, y, spriteName, scale) {
        let sprite = this.player.scene.add.sprite(x, y, spriteName).setOrigin(0, 0);
        sprite.setScrollFactor(0);
        sprite.setScale(scale)

        return sprite
    }
}
