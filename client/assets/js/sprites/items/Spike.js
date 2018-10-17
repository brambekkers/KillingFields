/**
 * 
 */
class Spike extends ArcadeItem{
    constructor(scene, x, y, options){
        super(scene, x, y, 'spike', null, options);

    }

    static preload(scene){
        scene.load.image('spike', 'assets/img/Items/spikes.png');
    }
}
