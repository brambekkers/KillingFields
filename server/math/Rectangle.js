const Vector2 = require('./Vector2');

/**
 *
 */
class Rectangle {
    /**
     *
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     *
     */
    static origin(width, height) {
        return new Rectangle(0, 0, width, height);
    }

    /**
     *
     */
    setOrigin(x, y) {
        this.x = x;
        this.y = y;

        return this;
    }

    /**
     *
     */
    setDimensions(width, height) {
        this.width = width;
        this.height = height;

        return this;
    }
    /**
     *
     */
    expand(horizontal, vertical = undefined) {
        vertical = vertical || horizontal;

        return new Rectangle(
            this.x - horizontal,
            this.y - vertical,
            this.width + 2 * horizontal,
            this.height + 2 * vertical,
        );
    }

    /**
     *
     */
    getRandomPosition() {
        return new Vector2(
            this.x + Math.random() * this.width,
            this.y + Math.random() * this.height
        );
    }
 }

 module.exports = Rectangle;
