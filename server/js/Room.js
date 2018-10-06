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
        this.players = {};

        this.bindEventHandlers();
    }

    /**
     *
     */
    bindEventHandlers() {
        // Connect handler.
        this.io.on('connection', function(socket) {
            // Create a new player.
            const player = new Player(socket);

            // Add player to list.
            this.addPlayer(player);
        }.bind(this));
    }

    /**
     * @param {Player} player
     */
    addPlayer(player) {
        this.players[player.socket.id] = player;

        player.socket.emit('players', players);

        player.socket.broadcast.emit('playerJoined', player);
    }
}

module.exports = Room;
