/**
 *
 */
export default class PlayerState {
    /**
     *
     */
    player;

    /**
     *
     */
    _isDucking = false;

    /**
     *
     */
    constructor(player) {
        this.player = player;
    }

    /**
     *
     */
    get canJump() {
        return (
            this.player.body.blocked.down ||
            this.player.body.touching.down
        );
    }

    /**
     *
     */
    get isGrounded() {
        return (
            this.player.body.blocked.down ||
            this.player.body.touching.down
        );
    }

    /**
     *
     */
    get isAirborne() {
        return !this.isGrounded;
    }

    /**
     *
     */
    get canDuck() {
        return (
            this.isGrounded &&
            !this.isWalking
        );
    }

    /**
     *
     */
    get isDucking() {
        return this._isDucking;
    }

    /**
     *
     */
    set isDucking(value) {
        this._isDucking = value;
    }

    /**
     *
     */
    get canStand() {
        return (
            !this.player.body.blocked.up &&
            !this.player.body.touching.up
        );
    }

    /**
     *
     */
    get isWalking() {
        return (
            (
                this.player.input.left &&
                !this.player.body.blocked.left
            ) ||
            (
                this.player.input.right &&
                !this.player.body.blocked.right
            )
        );
    }

    /**
     *
     */
    get isPushing() {
        return (
            (
                this.player.input.left &&
                this.player.body.blocked.left
            ) ||
            (
                this.player.input.right &&
                this.player.body.blocked.right
            )
        );
    }
}
