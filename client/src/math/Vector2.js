import Phaser from 'phaser';

/**
 *
 */
export default class Vector2 extends Phaser.Geom.Point {
    /**
     *
     */
    setTo(x, y) {
        this.x = x;
        this.y = y;

        return this;
    }

    /**
     *
     */
    getMagnitude() {
        return Phaser.Geom.Point.GetMagnitude(this);
    }

    /**
     *
     */
    setMagnitude(magnitude) {
        return Phaser.Geom.Point.SetMagnitude(this, magnitude);
    }

    /**
     *
     */
    normalize() {
        return this.divide(this.getMagnitude());
    }

    /**
     *
     */
    multiply(factor) {
        return new Vector2(
            this.x * (factor instanceof Vector2 ? value.x : factor),
            this.y * (factor instanceof Vector2 ? value.y : factor)
        );
    }

    /**
     *
     */
    divide(factor) {
        return new Vector2(
            this.x / (factor instanceof Vector2 ? value.x : factor),
            this.y / (factor instanceof Vector2 ? value.y : factor)
        );
    }

    /**
     *
     */
    add(value) {
        return new Vector2(
            this.x + (value instanceof Vector2 ? value.x : value),
            this.y + (value instanceof Vector2 ? value.y : value)
        );
    }

    /**
     *
     */
    subtract(value) {
        return new Vector2(
            this.x - (value instanceof Vector2 ? value.x : value),
            this.y - (value instanceof Vector2 ? value.y : value)
        );
    }
 }
