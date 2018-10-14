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

        // Register this enemy with the scene.
        this.scene.enemies[this.id] = this;
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

    /**
     *
     */
    destroy() {
        // Unregister this enemy from the scene.
        delete this.scene.enemies[this.id];

        super.destroy();
    }
}
