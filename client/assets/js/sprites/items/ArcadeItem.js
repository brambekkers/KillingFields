/**
 *
 */
class ArcadeItem extends ArcadeSprite {
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
        // Deregister this item from the scene.
        delete this.scene.projectiles[this.id];

        super.destroy();
    }
}
