/**
 *
 */
class Room {
    /**
     *
     */
    constructor() {
        this.players = [];
    }

    /**
     * @param {Player} player
     */
    addPlayer(player) {
        player.id = this.players.length + 1;

        this.players.push(player);

        player.socket.emit('playerJoined', {
            player: player.data(),
        });
    }
}

module.exports = Room;
