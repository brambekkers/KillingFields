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
     * The amount of spikes you get from a pickup
     */
    static amount = 2;

    /**
     * The number of health points a player loses when they collide with a
     * spike.
     */
    damage = 2;

    /**
     *
     */
    constructor(scene, data) {
        super(scene, {
            ...data,
            texture: 'spike',
        });

        this.scene.physics.add.collider(this, this.scene.getSolids());
        this.scene.physics.add.overlap(this, this.scene.player, this.onOverlapPlayer);

        

        this.scene.groups.spikes.add(this);

        this.setSize(70,35)
        this.body.setOffset(0, 35); 
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

        const spike = new Spike(player.scene, {
            position: position.add(direction.multiply(70)),
        });

        window.socket.emit('shoot', spike.toData());
    }

    /**
     *
     */
    onOverlapPlayer = (spike, player) => {
        player.hitBy(spike);
    };

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
