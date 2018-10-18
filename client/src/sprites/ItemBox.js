import ArcadeSprite from './ArcadeSprite';
import Lottery from '../math/Lottery';
import Fireball from './items/Fireball';
import Crate from './items/Crate';
import Spike from './items/Spike';

/**
 *
 */
export default class ItemBox extends ArcadeSprite {
    /**
     *
     */
    items = new Lottery()
        .enter(Fireball, 1)
        .enter(Crate, 1)
        .enter(Spike, 1);

    /**
     *
     */
    constructor(scene, data) {
        super(scene, Object.assign(data, {
            texture: 'itemBox',
        }));

        this.scene.physics.add.collider(this, this.scene.getSolids());
        this.scene.physics.add.overlap(this, this.scene.player, this.onOverlapPlayer);
    }

    /**
     *
     */
    static preload(scene) {
        scene.load.image('itemBox', 'assets/img/Tiles/boxItem.png');
    }

    /**
     *
     */
    onOverlapPlayer = (itemBox, player) => {
        player.addItem(itemBox.items.draw());
        itemBox.destroy();
    }
}
