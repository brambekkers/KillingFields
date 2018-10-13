/**
 *
 */
class Enemy extends Sprite {
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
