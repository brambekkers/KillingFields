/**
 *
 */
class Enemy extends Phaser.GameObjects.Sprite {
    /**
     *
     */
    constructor(scene, data) {
        super(scene, data.x, data.y, data.character);

        this.id = data.id;
        this.character = data.character;
        this.health = data.health;

        this.flipX = data.flipX;
        this.anims.play(data.animation, data.looping);

        this.scene.add.existing(this);
    }

    /**
     *
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     *
     */
    setAnimation(key, repeat, flipX) {
        this.anims.play(key, repeat);
        this.flipX = flipX;
    }

    /**
     *
     */
    setHealth(health) {
        this.health = health;
    }
}
