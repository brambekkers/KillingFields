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
        this.background = this.scene.add.image(0, 0, 'hudAchtergrond').setOrigin(0, 0);
        this.background.setScrollFactor(0);
        this.background.setScale(0.8)

        // HUD CHAR
        this.char = this.scene.add.sprite(10, 10, `hudPlayer${player.characterNum}`).setOrigin(0, 0);
        this.char.setScrollFactor(0);
        this.char.setScale(1.8)

        // HUD HEALTH HEART
        this.heartHealth = this.scene.add.sprite(120, 10, 'heartHealth').setOrigin(0, 0);
        this.heartHealth.anims.play(`heartHealth10`);
        this.heartHealth.setScrollFactor(0);
        this.heartHealth.setScale(0.9)

        // HUD TEXT
        this.killText = this.scene.add.text(290, 21, player.kills).setOrigin(1, 0);
        this.killText.setFontSize(18);
        this.killText.setColor('#674b25');
        this.killText.setFontStyle('bold italic');
        this.killText.setFontFamily('Arial');
        this.killText.setScrollFactor(0);
    }

    
}