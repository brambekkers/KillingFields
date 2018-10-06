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
        this.players.push(player);
    }
}

module.exports = Room;
