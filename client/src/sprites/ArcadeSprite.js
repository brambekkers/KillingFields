import Phaser from 'phaser';

/**
 * @abstract
 */
export default class ArcadeSprite extends Phaser.Physics.Arcade.Sprite {
    /**
     *
     */
     id;

    /**
     *
     */
    constructor(scene, data) {
        super(scene, data.position.x, data.position.y, data.texture);

        // Generate an ID.
        this.id = data.id || new Date().getTime(); // TODO: User a better ID.

        // Set facing direction.
        this.flipX = data.flipX || false;

        // Set the animation.
        if (data.animation) {
            this.anims.play(data.animation.key, data.animation.repeat);
        }

        // Add the sprite to the scene.
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Set the velocity.
        if (data.velocity) {
            this.body.setVelocity(
                data.velocity.x,
                data.velocity.y
            );
        }
    }

    /**
     * Returns the data representation of this instance, so that it can be sent
     * to the server.
     */
    toData() {
        return {
            id: this.id,
            position: {
                x: this.x,
                y: this.y,
            },
            flipX: this.flipX,
            animation: this.anims.currentAnim ? {
                key: this.anims.currentAnim.key,
                repeat: this.anims.currentAnim.repeat,
            } : null,
            velocity: this.body.velocity,
        };
    }

    /**
     * Destroys this sprite.
     */
    destroy() {
        this.body.destroy();
        super.destroy();
    }
}
