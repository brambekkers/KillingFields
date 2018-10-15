import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import Hud from '../../Hud';
import Player from '../../sprites/Player';
import Enemy from '../../sprites/Enemy';
import Fireball from '../../sprites/items/Fireball';
import Crate from '../../sprites/items/Crate';

/**
 * @abstract
 */
export default class Level extends Scene {
    /**
     *
     */
    dimensions = new Vector2(
        window.innerWidth,
        window.innerHeight
    );

    /**
     *
     */
    background;

    /**
     *
     */
    layers = {};

    /**
     *
     */
    groups = {};

    /**
     *
     */
    enemies = {};

    /**
     *
     */
    projectiles = {};

    /**
     *
     */
    preload() {
        // Tilemap
        this.load.image('tiles', 'assets/maps/tiles_spritesheet.png');

        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

        Hud.preload(this);
        Player.preload(this);
        Fireball.preload(this);
        Crate.preload(this);
    }

    /**
     *
     */
    create() {
        this.physics.world.setBounds(0, 0, this.dimensions.x, this.dimensions.y);
        this.cameras.main.setBounds(0, 0, this.dimensions.x, this.dimensions.y);

        this.createBackground();
        this.createLayers();
        this.createGroups();

        this.createAnimations();

        this.bindSocketEvents();

        this.start();
    }

    /**
     *
     */
    createBackground() {
        this.background = this.add.tileSprite(this.dimensions.x / 2, this.dimensions.y / 2, this.dimensions.x, this.dimensions.y, 'background');
    }

    /**
     *
     */
    createLayers() {
        this.createPlatformLayer();
        this.createObjectLayer();
        this.createDecorationLayer();
    }

    /**
     *
     */
    createLayer(key, tileWidth = 70, tileHeight = 70) {
        const tilemap = this.make.tilemap({
            key,
            tileWidth,
            tileHeight,
        });

        const tileset = tilemap.addTilesetImage('tiles');

        return tilemap.createDynamicLayer(0, tileset, 0, 0);
    }

    /**
     *
     */
    createPlatformLayer() {
        this.layers.platforms = this
            .createLayer('platforms')
            .setCollisionBetween(1, 200);
    }

    /**
     *
     */
    createObjectLayer() {
        this.layers.objects = this
            .createLayer('objects')
            .setCollisionBetween(1, 200);
    }

    /**
     *
     */
    createDecorationLayer() {
        this.layers.decoration = this.createLayer('decoration');
    }

    /**
     *
     */
    createGroups() {
        this.createCrateGroup();
    }

    /**
     *
     */
    createCrateGroup() {
        this.groups.crates = this.physics.add.group({
            // Initial angular speed of 60 degrees per second.
            // Drag reduces it by 5 degrees/s per second, thus to zero after 12 seconds.
            // angularDrag: 5,
            // angularVelocity: 60,
            // bounceX: 0.05,
            // bounceY: 0,
            collideWorldBounds: false,
            dragX: 1000,
            // dragY: 1000
        });
    }

    /**
     *
     */
    createAnimations() {
        Player.createAnimations(this);
        Hud.createAnimations(this);
    }

    /**
     *
     */
    bindSocketEvents() {
        socket.on('gameStarted', this.onGameStarted.bind(this));
        socket.on('enemyJoined', this.onEnemyJoined.bind(this));
        socket.on('enemyLeft', this.onEnemyLeft.bind(this));
        socket.on('enemyMoved', this.onEnemyMoved.bind(this));
        socket.on('enemyShot', this.onEnemyShoot.bind(this));
        socket.on('projectileDestroyed', this.onProjectileDestroyed.bind(this)); // TODO: Should be part of onEnemyHit.
        socket.on('enemyHit', this.onEnemyHit.bind(this));
        socket.on('enemyDied', this.onEnemyDied.bind(this));
    }

    /**
     *
     */
    start() {
        socket.emit('start');
    }

    /**
     *
     */
    update() {
        if (this.player) {
            this.player.update();
        }

        for (const key of Object.keys(this.projectiles)) {
            this.projectiles[key].update();
        }
    }

    /**
     *
     */
    onGameStarted(game) {
        this.addPlayer(game.player);

        for (const enemy of game.enemies) {
            this.addEnemy(enemy);
        }
    }

    /**
     *
     */
    getSolids() {
        return [
            this.layers.platforms,
            this.layers.objects,
            this.groups.crates,
        ];
    }

    /**
     *
     */
    addPlayer(data) {
        this.player = new Player(this, data);

        this.physics.add.collider(this.player, [
            this.layers.platforms,
            this.layers.objects,
        ]);

        // camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        return this.player;
    }

    /**
     *
     */
    onEnemyJoined(data) {
        this.addEnemy(data);
    }

    /**
     *
     */
    addEnemy(data) {
        return new Enemy(this, data);
    }

    /**
     *
     */
    getEnemy(id) {
        const enemy = this.enemies[id];

        if (!enemy) {
            throw new Error(`Enemy ${id} does not exist.`);
        }

        return enemy;
    }

    /**
     *
     */
    getProjectile(id) {
        const projectile = this.projectiles[id];

        if (!projectile) {
            throw new Error(`Projectile ${id} does not exist.`);
        }

        return projectile;
    }

    /**
     *
     */
    onEnemyMoved(enemyData) {
        try {
            const enemy = this.getEnemy(enemyData.id);

            enemy.updatePosition(enemyData.position);
            enemy.updateFacing(enemyData.flipX);
            enemy.updateAnimation(enemyData.animation);
        } catch (error) {
            console.warn('Failed to update enemy.', error);
        }
    }

    /**
     *
     */
    onEnemyLeft(id) {
        try {
            const enemy = this.getEnemy(id);

            enemy.destroy();
        } catch (error) {
            console.warn('Failed to remove enemy.', error);
        }
    }

    /**
     *
     */
    onEnemyShoot(data) {
        this.addEnemyProjectile(data);
    }

    /**
     *
     */
    addEnemyProjectile(data) {
        switch (data.type) {
            case 'fireball':
                return this.addEnemyFireball(data);

            case 'crate':
                return this.addEnemyCrate(data);
        }
    }

    /**
     *
     */
    addEnemyFireball(data) {
        const fireball = new Fireball(this, data);

        if (this.player) {
            this.physics.add.collider(fireball, this.player, this.onPlayerHit.bind(this));
        }

        return fireball;
    }

    /**
     *
     */
    addEnemyCrate(data) {
        return new Crate(this, data);
    }

    /**
     *
     */
    onPlayerHit(projectile, playerSprite) {
        this.player.hitBy(projectile);
    }

    /**
     *
     */
    onProjectileDestroyed(id) {
        try {
            let projectile = this.getProjectile(id);

            projectile.destroy();
        } catch (error) {
            console.warn('Failed to destroy projectile.', error);
        }
    }

    /**
     *
     */
    onEnemyHit(enemyData) {
        try {
            const enemy = this.getEnemy(enemyData.id);

            enemy.updateHealth(enemyData.health);
        } catch (error) {
            console.warn('Failed to update enemy health.', error);
        }
    }

    /**
     *
     */
    onEnemyDied(enemyData) {
        try {
            let enemy = this.getEnemy(enemyData.id);

            enemy.destroy();
        } catch (error) {
            console.warn('Failed to destroy enemy.', error);
        }
    }
}
