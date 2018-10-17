/**
 *
 */
export default class PlayerInput {
    /**
     *
     */
    keys = {};

    /**
     *
     */
    constructor(player) {
        this.keys.up = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keys.down = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keys.left = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keys.right = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keys.space = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keys.a = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.w = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.s = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys.d = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys.e = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keys.f = player.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    /**
     *
     */
    get left() {
        return (
            this.keys.left.isDown ||
            this.keys.a.isDown
        );
    }

    /**
     *
     */
    get right() {
        return (
            this.keys.right.isDown ||
            this.keys.d.isDown
        );
    }

    /**
     *
     */
    get horizontal() {
        return this.left * -1 + this.right * 1;
    }

    /**
     *
     */
    get up() {
        return (
            this.keys.up.isDown ||
            this.keys.w.isDown
        );
    }

    /**
     *
     */
    get down() {
        return (
            this.keys.down.isDown ||
            this.keys.s.isDown
        );
    }

    /**
     *
     */
    get vertical() {
        return this.up * -1 + this.down * 1;
    }

    /**
     *
     */
    get primary() {
        return this.keys.f.isDown;
    }

    /**
     *
     */
    get secondary() {
        return this.keys.e.isDown;
    }

    /**
     *
     */
    get jump() {
        return this.keys.space.isDown;
    }
}
