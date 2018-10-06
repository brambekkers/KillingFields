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
        this.players.push(player);

        player.socket.emit('players', this.players.map(function (player) {
            return player.toData();
        }));
        console.log("test server")

        player.socket.emit('playerJoined', player.toData());
    }
}

module.exports = Room;
