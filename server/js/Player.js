/**
 *
 */
class Player {
    /**
     * @param {Socket} socket
     */
    constructor(socket) {
        console.log('User connected.');

        this.socket = socket;
        this.x = Math.random(0, 800);
        this.y = Math.random(0, 600);

        this.bindEventHandlers();
    }

    /**
     *
     */
    bindEventHandlers() {
        this.socket.on('disconnect', this.onDisconnect.bind(this));
        this.socket.on('move', this.onMove.bind(this));
    }

    /**
     *
     */
    onDisconnect() {
        console.log('User disconnected.');

        // Tell everyone that the player has left.
        this.socket.broadcast.emit('playerLeft', this.socket.id);
    }

    /**
     *
     */
    onMove() {
        console.log('Player moved.');
    }

    /**
     *
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;

        this.socket.broadcast.emit('playerMoved', player);
    };
}

module.exports = Player;