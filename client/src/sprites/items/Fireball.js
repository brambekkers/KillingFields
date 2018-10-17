import ArcadeItem from './ArcadeItem';
import Vector2 from '../../math/Vector2';

/**
 *
 */
export default class Fireball extends ArcadeItem {
    /**
     * The name of the image asset that should be displayed in the HUD.
     */
    static icon = 'fireball';

    /**
     * The number of health points a player loses when they collide with a
     * fireball.
     */
    damage = 1;

    /**
     * The number of times a fireball can bounce against a solid before being
     * destroyed.
     */
    bounces = 3;

    /**
     * Constructs a Fireball.
     */
    constructor(scene, data) {
        super(scene, Object.assign(data, {
            texture: 'fireball',
            flipX: data.flipX || (data.velocity
                ? data.velocity.x < 0
                : false
            ),
        }));

        this.setBounce(0.95);
        this.body.width = 20;
        this.body.height = 20;
        this.body.setOffset(25, 25);

        this.scene.physics.add.collider(this, this.scene.getSolids(), this.onBounce);
    }

    /**
     * Preloads the assets needed for this item.
     */
    static preload(scene) {
        scene.load.image('fireball', 'assets/img/Items/fireball.png');
    }

    /**
     *
     */
    static use(player) {
        const position = new Vector2(player.x, player.y);
        const direction = new Vector2(player.flipX ? -1 : 1, 0).normalize();

        const fireball = new Fireball(player.scene, {
            position: position.add(direction.multiply(20)),
            velocity: direction.setMagnitude(500),
        });

        socket.emit('shoot', fireball.toData());
    }

    /**
     *
     */
    update() {
        if (this.bounces < 0) {
            this.destroy();
            return;
        }

        this.faceDirection();
        this.rotate();
    }

    /**
     *
     */
    faceDirection() {
        this.flipX = this.body.velocity.x < 0 ? true : false;
    }

    /**
     *
     */
    rotate() {
        this.angle += 20 * (this.flipX ? -1 : 1);
    }

    /**
     *
     */
    onBounce = () => {
        this.bounces--;
    }

    /**
     * Returns the data representation of this instance, so that it can be sent
     * to the server.
     */
    toData() {
        return Object.assign(super.toData(), {
            type: 'fireball',
        });
    }
}
