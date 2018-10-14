/**
 *
 */
class Fireball extends ArcadeItem {
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

        this.cooldown = 30;
        this.damage = 1;
        this.bounces = 3;

        this.setBounce(0.95);
        this.body.width = 20;
        this.body.height = 20;
        this.body.setOffset(25, 25);

        this.scene.physics.add.collider(this, this.scene.getSolids(), this.onBounce.bind(this));
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
    onBounce() {
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
