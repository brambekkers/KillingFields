export default class Player{
    constructor(x = width/2, y = height/2, r=20){
        this.x = x
        this.y = y
        this.r = r
    }

    show(){
        console.log("Ik ben geladen")
    }

    update(){
        console.log("Ik wordt geupdate")

    }

}