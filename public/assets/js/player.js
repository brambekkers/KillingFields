export default class Player{
    constructor(x = width/2, y = height/2, r=20){
        this.x = x
        this.y = y
        this.r = r
        this.circle = null
    }

    show(){
        console.log("Ik ben geladen")
        this.circle = new Phaser.Geom.Circle(this.x, this.y, this.r);
    }

    update(){
        console.log("Ik wordt geupdate")

    }

}