import ArcadeItem from './ArcadeItem';
import Vector2 from '../../math/Vector2';

/**
 *
 */
export default class Spike extends ArcadeItem {
    /**
     * The name of the image asset that should be displayed in the HUD.
     */
    static icon = 'spike';

    /**
     * The number of health points a player loses when they collide with a
     * spike.
     */
    damage = 2;

    /**
     *
     */
    constructor(scene, data) {
        super(scene, Object.assign(data, {
            texture: 'spike',
        }));

        this.scene.physics.add.collider(this, this.scene.getSolids());
        this.scene.physics.add.overlap(this, this.scene.player, this.onOverlapPlayer);

        this.scene.groups.spikes.add(this);
    }

    /**
     *
     */
    static preload(scene) {
        scene.load.image('spike', 'assets/img/Items/spikes.png');
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
            type: 'spike',
        });
    }
}
