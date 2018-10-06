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

        this.x = Math.random() * 1024;
        this.y = Math.random() * 512 - 70;
        this.animation = 'turn';
        this.looping = false;
        this.flipX = false;

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
    onMove(data) {
        this.x = data.x;
        this.y = data.y;
        this.animation = data.animation;
        this.looping = data.looping;
        this.flipX = data.flipX;

        this.socket.broadcast.emit('playerMoved', this.toData());
    }

    /**
     *
     */
    toData() {
        return {
            id: this.socket.id,
            x: this.x,
            y: this.y,
            animation: this.animation,
            looping: this.looping,
            flipX: this.flipX,
        };
    }
}

module.exports = Player;
