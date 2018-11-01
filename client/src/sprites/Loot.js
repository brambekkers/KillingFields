import ArcadeSprite from './ArcadeSprite';
import Lottery from '../math/Lottery';
import Fireball from './items/Fireball';
import Crate from './items/Crate';
import Spike from './items/Spike';

/**
 *
 */
export default class Loot extends ArcadeSprite {
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

        // Register this item with the scene.
        this.scene.loot[this.id] = this;
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
        player.addSecondaryItem(itemBox.items.draw());
        itemBox.destroy();
    };

    /**
     * Destroys this item.
     */
    destroy() {
        // Unregister this loot from the scene.
        delete this.scene.loot[this.id];

        // Tell the server that the loot is destroyed.
        window.socket.emit('destroyLoot', this.id);

        super.destroy();
    }
}
