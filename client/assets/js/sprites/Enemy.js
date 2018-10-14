/**
 *
 */
class Enemy extends Sprite {
    /**
     *
     */
    constructor(scene, data) {
        super(scene, data);

        this.health = data.health;
    }

    /**
     *
     */
    updatePosition(position) {
        this.x = position.x;
        this.y = position.y;
    }

    /**
     *
     */
    updateFacing(flipX) {
        this.flipX = flipX;
    }

    /**
     *
     */
    updateAnimation(animation) {
        this.anims.play(animation.key, animation.repeat);
    }

    /**
     *
     */
    updateHealth(health) {
        this.health = health;
    }
}
