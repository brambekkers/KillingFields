class Hud {
    constructor(scene) {
        this.scene = scene

        this.background = null
        this.char =  null
        this.heartHealth = null
        this.killText= null

        this.create()
    }


    static preload(scene){
        scene.load.image('voorbeeldHud', 'assets/img/HUD/voorbeeldHud.png');
        scene.load.image('hudAchtergrond', 'assets/img/HUD/hudAchtergrond.png');
        scene.load.spritesheet('heartHealth', 'assets/img/HUD/hudHealth/heartSpritesheet.png', { frameWidth: 53, frameHeight: 45});

        for (let i = 1; i <= 3; i++) {
            scene.load.image(`hudPlayer${i}`, `assets/img/HUD/hud${i}/hud.png`);
        }
    }

    create(){
        // HUD Achtergrond
        this.background = this.createSprite(0, 0, 'hudAchtergrond', 0.8)
        this.char = this.createSprite(12, 10, `hudPlayer${this.scene.player.characterNum}`, 1.8)
        this.heartHealth = this.createSprite(120, 10, 'heartHealth', 0.9)
        this.heartHealth.anims.play(`heartHealth10`);

        // HUD TEXT
        this.killText = this.scene.add.text(290, 21, this.scene.player.kills).setOrigin(1, 0);
        this.killText.setFontSize(18);
        this.killText.setColor('#674b25');
        this.killText.setFontStyle('bold italic');
        this.killText.setFontFamily('Arial');
        this.killText.setScrollFactor(0);
    }

    createSprite(x, y, spriteName, scale){
        let sprite = this.scene.add.sprite(x, y, spriteName).setOrigin(0, 0);
        sprite.setScrollFactor(0);
        sprite.setScale(scale)

        return sprite
    }


}
