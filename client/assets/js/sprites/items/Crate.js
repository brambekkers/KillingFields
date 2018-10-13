/**
 * 
 */
class Crate extends ArcadeItem{
    constructor(scene, x, y, options){
        super(scene, x, y, Crate.randomTexture(), null, options);

    }

    static randomTexture(){
        let randomNum = Math.floor(Math.random() * 3 );
        return `crate${randomNum}`
    }

    static preload(scene){
        scene.load.image('crate0', 'assets/img/Tiles/box.png');
        scene.load.image('crate1', 'assets/img/Tiles/boxEmpty.png');
        scene.load.image('crate2', 'assets/img/Tiles/boxAlt.png');
    }
}
