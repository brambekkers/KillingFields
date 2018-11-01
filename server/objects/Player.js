const _ = require('lodash');
const GameObject = require('./GameObject');
const config = require('../config');

/**
 *
 */
class Player extends GameObject {
    /**
     *
     */
    constructor(socket, room) {
        super(room, {
            id: socket.id,
            position: room.level.bounds
                .expand(-config.GRID_SIZE)
                .getRandomPosition(),
        });

        this.socket = socket;

        const data = _.sample(config.players);
        this.character = data.character;
        this.texture = data.texture;
        this.health = data.health;

        this.animation = {
            key: `${this.character}_turn`,
            repeat: false,
        };
        this.flipX = false;

        this.bindEventHandlers();
    }

    /**
     *
     */
    bindEventHandlers() {
        this.socket.on('disconnect', this.onDisconnect.bind(this));

        this.socket.on('move', this.onPlayerUpdate.bind(this));
        this.socket.on('hit', this.onPlayerHit.bind(this));
        this.socket.on('died', this.onPlayerDie.bind(this));

        this.socket.on('shoot', this.onItemCreate.bind(this));
        this.socket.on('itemUpdated', this.onItemUpdate.bind(this));
        this.socket.on('itemDestroyed', this.onItemDestroy.bind(this));

        this.socket.on('destroyLoot', this.onDestroyLoot.bind(this));
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
    onPlayerUpdate(data) {
        this.position = data.position;
        this.animation = data.animation;
        this.flipX = data.flipX;

        this.socket.broadcast.emit('enemyMoved', this.toData());
    }

    /**
     * @todo Use an Item class instead of storing the data directly.
     */
    onItemCreate(data) {
        this.room.items[data.id] = data;
        this.socket.broadcast.emit('itemCreated', data);
    }

    /**
     * @todo Use an Item class instead of storing the data directly.
     */
    onItemUpdate(data) {
        this.room.items[data.id] = data;
        this.socket.broadcast.emit('itemUpdated', data);
    }

    /**
     *
     */
    onItemDestroy(id) {
        delete this.room.items[id];
        this.socket.broadcast.emit('itemDestroyed', id);
    }

    /**
     *
     */
    onDestroyLoot(id) {
        delete this.room.loot[id];
        this.socket.broadcast.emit('lootDestroyed', id);
    }

    /**
     *
     */
    onPlayerHit(damage) {
        this.health -= damage;
        this.socket.broadcast.emit('enemyHit', this.toData());
    }

    /**
     *
     */
    onPlayerDie() {
        this.health = 0;
        this.socket.broadcast.emit('enemyDied', this.toData());
    }

    /**
     *
     */
    toData() {
        return {
            id: this.id,
            character: this.character,
            texture: this.texture,
            health: this.health,
            position: this.position,
            animation: this.animation,
            flipX: this.flipX,
        };
    }
}

module.exports = Player;
