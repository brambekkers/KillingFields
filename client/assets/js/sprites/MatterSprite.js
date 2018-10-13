/**
 * @abstract
 */
class MatterSprite extends Phaser.Physics.Matter.Sprite {
    /**
     *
     */
    constructor(scene, x, y, texture, frame, options) {
        super(scene, x, y, texture, frame, options);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
}
