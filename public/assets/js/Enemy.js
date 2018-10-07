/**
 *
 */
class Enemy {
    /**
     *
     */
    constructor(scene, data) {
        this.scene = scene;

        this.id = data.id;
        this.caracter = data.character;
        this.health = data.health;

        this.sprite = this.scene.add.sprite(data.x, data.y, data.character);
        this.sprite.flipX = data.flipX;
        this.sprite.anims.play(data.animation, data.looping);
    }

    /**
     *
     */
    setPosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    /**
     *
     */
    setAnimation(key, repeat, flipX) {
        this.sprite.anims.play(key, repeat);
        this.sprite.flipX = flipX;
    }

    /**
     *
     */
    setHealth(health) {
        this.health = health;
    }
}
