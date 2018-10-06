class Player{
    constructor(scene, player){
        this.scene = scene
        this.id = player.id
        this.x = player.x || 800/2
        this.y = player.y || 600/2

        this.r = 20
        this.sprite = null

        this.create()
    }

    create(){
        this.sprite = this.scene.physics.add.sprite(100, 450, 'player');
    }

    update(){


    }

}
