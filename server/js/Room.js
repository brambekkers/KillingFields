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
        this.io.on('connection', this.onConnect.bind(this));
    }

    /**
     *
     */
    onConnect(socket) {
        console.log('Player connected.');

        // Create a new player.
        const player = new Player(socket, this);

        // Add player to list.
        this.addPlayer(player);
    }

    /**
     * @param {Player} player
     */
    addPlayer(player) {
        // Tell the player to start the game.
        player.socket.emit('gameStarted', {
            self: player.toData(),
            others: this.players.map(function (player) {
                return player.toData();
            }),
        });

        // Add the player.
        this.players.push(player);

        // Tell everyone that the player has joined.
        player.socket.broadcast.emit('playerJoined', player.toData());
    }

    /**
     * @param {Player} player
     */
    removePlayer(player) {
        // Tell everyone that the player has left.
        player.socket.broadcast.emit('playerLeft', this.id);
        console.log("player verlaat het spel")
        // Filter out the player.
        this.players = this.players.filter(function (other) {
            return other.id !== player.id;
        });
    }
}

module.exports = Room;
