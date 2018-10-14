/**
 * @abstract
 */
class Sprite extends Phaser.GameObjects.Sprite {
    /**
     *
     */
    constructor(scene, data) {
        super(scene, data.x, data.y, data.texture);

        // Generate an ID.
        this.id = data.id || new Date().getTime(); // TODO: User a better ID.

        // Set faing direction.
        this.flipX = data.flipX || false;

        // Set the animation.
        if (data.animation) {
            this.anims.play(data.animation.key, data.animation.repeat);
        }

        // Add the sprite to the scene.
        this.scene.add.existing(this);
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
        };
    }
}
