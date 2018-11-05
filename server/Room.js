const _ = require('lodash');
const Player = require('./objects/Player');
const Loot = require('./objects/Loot');
const config = require('./config');

/**
 *
 */
class Room {
    /**
     *
     */
    constructor(io) {
        this.io = io;

        this.level = _.sample(config.levels);
        this.players = {};
        this.items = {};
        this.loot = {};
        this.rooms = {};

        this.bindEventHandlers();

        this.addLoot();
    }

    /**
     * 
     */
    onConnect(socket) {
        // Create a new player.
        const player = new Player(socket, this);


        socket.on('start', () => {
            this.onStart(socket, player);
        });

        socket.on('createRoom', (roomID) => {
            this.createRoom(socket, player, roomID);
            return this.rooms
        });

        

        console.log('Player joined lobby.');
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
    addLoot() {
        const loot = new Loot(this);

        this.io.emit('lootCreated', loot.toData());

        this.loot[loot.id] = loot;

        if (Object.keys(this.loot).length < this.level.loot.spawns) {
            const timeout = this.level.loot.interval.min + Math.random() * this.level.loot.interval.max;
            setTimeout(this.addLoot.bind(this), timeout);
        }
    }

    /**
     *
     */
    onStart(socket, player) {
        // Add player to list.
        this.addPlayer(player);

        console.log('Player started.');
    }

    createRoom(socket, player, roomID){
        console.log('New Room created:', roomID)

        this.rooms[roomID] = {
            players: [player.id],
        };

        player.roomName = roomID;
        
        // Tell everyone that the room has created.
        player.socket.broadcast.emit('roomCreated', this.rooms);
    }

    changeRoom(){
        console.log('roomchanged')
    }

    /**
     * @param {Player} player
     */
    addPlayer(player) {
        // Tell the player to start the game.
        player.socket.emit('gameStarted', {
            player: player.toData(),
            enemies: Object.values(this.players)
                .map(function (player) {
                    return player.toData();
                }),
            items: Object.values(this.items),
            loot: Object.values(this.loot)
                .map(function (loot) {
                    return loot.toData();
                }),
        });

        // Add the player.
        this.players[player.id] = player;

        // Tell everyone that the player has joined.
        player.socket.broadcast.emit('enemyJoined', player.toData());
    }

    /**
     * @param {Player} player
     */
    removePlayer(player) {
        // Tell everyone that the player has left.
        player.socket.broadcast.emit('enemyLeft', player.socket.id);

        // Delete out the player.
        delete this.players[player.id];
    }
}

module.exports = Room;
