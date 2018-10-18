import ArcadeSprite from '../ArcadeSprite';

/**
 * @abstract
 */
export default class ArcadeItem extends ArcadeSprite {
    /**
     * The cooldown duration of this item in frames.
     */
    static cooldown = 30;

    /**
     * Creates an ArcadeItem.
     */
    constructor(scene, data) {
        super(scene, data);

        // Register this item with the scene.
        this.scene.projectiles[this.id] = this;
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
     * Destroys this item.
     */
    destroy() {
        // Unregister this item from the scene.
        delete this.scene.projectiles[this.id];

        super.destroy();
    }
}
