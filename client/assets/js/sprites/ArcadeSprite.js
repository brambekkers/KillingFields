/**
 * @abstract
 */
class ArcadeSprite extends Phaser.Physics.Arcade.Sprite {
    /**
     *
     */
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
}
