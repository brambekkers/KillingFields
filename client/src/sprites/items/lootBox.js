import ArcadeItem from './ArcadeItem';
import Vector2 from '../../math/Vector2';

/**
 *
 */
export default class lootBox extends ArcadeItem {
    /**
     * The name of the image asset that should be displayed in the HUD.
     */
    static icon = 'lootBox';

    /**
     *
     */
    constructor(scene, data) {
        super(scene, Object.assign(data, {
            texture: 'lootBox',
        }));

        this.scene.physics.add.collider(this, this.scene.getSolids());
        this.scene.physics.add.overlap(this, this.scene.player, this.onOverlapPlayer);

        this.scene.groups.lootBox.add(this);
    }

    /**
     *
     */
    static preload(scene) {
        scene.load.image('lootBox', 'assets/img/Tiles/boxItem.png');
    }

    /**
     *
     */
    static use(player) {
        const position = new Vector2(player.x, player.y);
        const direction = new Vector2(player.flipX ? -1 : 1, 0).normalize();

        const crate = new Spike(player.scene, {
            position: position.add(direction.multiply(70)),
        });

        socket.emit('shoot', crate.toData());
    }

    /**
     *
     */
    onOverlapPlayer = (spike, player) => {
        player.hitBy(spike);
    }

    /**
     * Returns the data representation of this instance, so that it can be sent
     * to the server.
     */
    toData() {
        return Object.assign(super.toData(), {
            type: 'lootBox',
        });
    }
}
