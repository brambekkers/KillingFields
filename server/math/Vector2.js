/**
 *
 */
class Vector2 {
    /**
     *
     */
    constructor(x, y = undefined) {
        this.x = x;
        this.y = typeof y !== 'undefined' ? y : x;
    }

    /**
     *
     */
    static zero() {
        return new Vector2(0, 0);
    }

    /**
     *
     */
    static unit() {
        return new Vector2(1, 1);
    }

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
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    /**
     *
     */
    setMagnitude(magnitude) {
        if (magnitude === 0) {
            return Vector2.zero();
        }

        return this.multiply(this.getMagnitude() / magnitude);
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

 module.exports = Vector2;
