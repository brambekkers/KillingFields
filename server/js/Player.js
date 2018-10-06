/**
 *
 */
class Player {
    /**
     * @param {Socket} socket
     */
    constructor(socket, room) {
        this.socket = socket;
        this.room = room;

        this.x = Math.random() * 800;
        this.y = Math.random() * 600;

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
        console.log('Player disconnected.');

        this.room.removePlayer(this);
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

    /**
     *
     */
    toData() {
        return {
            id: this.socket.id,
            x: this.x,
            y: this.y,
        };
    }
}

module.exports = Player;
