class Player{
    constructor(scene, player){
        this.scene = scene
        this.id = player.id
        this.x = player.x || 800/2
        this.y = player.y || 600/2

        this.r = 20
        this.circle = null

        this.create()
    }

    create(){
        this.circle = new Phaser.Geom.Circle(this.x, this.y, this.r);

        let graphics = this.scene.add.graphics({ fillStyle: { color: 0xff0000 } });
        graphics.fillCircleShape(this.circle);
    }

    update(){


    }

}