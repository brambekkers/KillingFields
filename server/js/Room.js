const Player = require('./Player');

/**
 *
 */
class Room {
    /**
     *
     */
    constructor(io) {
        this.io = io;
        this.players = [];

        this.bindEventHandlers();
    }

    /**
     *
     */
    bindEventHandlers() {
        // Connect handler.
        this.io.on('connection', this.onConnect.bind(this));
    }

    /**
     *
     */
    onConnect(socket) {
        // Create a new player.
        const player = new Player(socket);

        // Add player to list.
        this.addPlayer(player);
    }

    /**
     * @param {Player} player
     */
    addPlayer(player) {
        player.socket.emit('gameStarted', {
            self: player.toData(),
            others: this.players.map(function (player) {
                return player.toData();
            }),
        });

        this.players.push(player);

        player.socket.broadcast.emit('playerJoined', player.toData());
    }
}

module.exports = Room;
