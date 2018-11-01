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
        this.scene.items[this.id] = this;
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
        delete this.scene.items[this.id];

        // Tell the server that the item is destroyed.
        window.socket.emit('itemDestroyed', this.id);

        super.destroy();
    }
}
