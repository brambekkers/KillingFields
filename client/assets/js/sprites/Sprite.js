/**
 * @abstract
 */
class Sprite extends Phaser.GameObjects.Sprite {
    /**
     *
     */
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.scene.add.existing(this);
    }
}
