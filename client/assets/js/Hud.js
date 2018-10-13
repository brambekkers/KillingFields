class Hud {
    constructor(scene) {
        this.scene = scene

        this.background = null
        this.char =  null 
        this.heartHealth = null

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
        this.background = this.scene.add.image(0, 0, 'hudAchtergrond');
        this.background.setScrollFactor(0);

        // HUD CHAR
        this.char = this.scene.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 100, `hudPlayer${this.characterNum}`);
        this.char.setScale(1.6)
        // HUD HEALTH HEART
        this.heartHealth = this.scene.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 40, 'heartHealth');
        this.heartHealth.anims.play(`heartHealth10`);
        this.heartHealth.setScale(0.8)
    }

    
}