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

        this.character = `player${1 + Math.round(Math.random() * 2)}`;
        this.health = 3;
        this.x = Math.random() * 1024;
        this.y = Math.random() * 512 - 70;

        this.animation = `${this.character}_turn`;
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
        this.socket.on('shoot', this.onShoot.bind(this));
        this.socket.on('projectileDestroyed', this.onProjectileDestroyed.bind(this)); // TODO: Should be part of onHit.
        this.socket.on('hit', this.onHit.bind(this));
        this.socket.on('died', this.onDie.bind(this));
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

        this.socket.broadcast.emit('enemyMoved', this.toData());
    }

    /**
     * @todo Store projectile in array, so that we can send them to newly joined players.
     */
    onShoot(data) {
        this.socket.broadcast.emit('enemyShot', data);
    }

    /**
     * @todo Should be part of onHit.
     */
    onProjectileDestroyed(id) {
        this.socket.broadcast.emit('projectileDestroyed', id);
    }

    /**
     * @todo
     */
    onHit(damage) {
        this.health -= damage;
        this.socket.broadcast.emit('enemyHit', this.toData());
    }

    /**
     * @todo
     */
    onDie() {
        this.health = 0;
        this.socket.broadcast.emit('enemyDied', this.toData());
    }

    /**
     *
     */
    toData() {
        return {
            id: this.socket.id,
            character: this.character,
            health: this.health,
            x: this.x,
            y: this.y,
            animation: this.animation,
            looping: this.looping,
            flipX: this.flipX,
        };
    }
}

module.exports = Player;
