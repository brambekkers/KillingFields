/**
 *
 */
class ArcadeItem extends ArcadeSprite {
    /**
     *
     */
    static get cooldown() {
        return 30;
    }

    /**
     * Creates an ArcadeItem.
     */
    constructor(scene, data) {
        super(scene, data);

        // Register this item with the scene.
        this.scene.projectiles[this.id] = this;
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
