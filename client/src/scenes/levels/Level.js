import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import Hud from '../../Hud';
import Player from '../../sprites/Player';
import Enemy from '../../sprites/Enemy';
import ItemBox from '../../sprites/ItemBox';
import Fireball from '../../sprites/items/Fireball';
import Crate from '../../sprites/items/Crate';
import Spike from '../../sprites/items/Spike';

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
    items = {};

    /**
     *
     */
    preload() {
        // Tilemap
        this.load.image('tiles', 'assets/maps/tiles_spritesheet.png');

        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

        // Player
        Player.preload(this);
        Hud.preload(this);

        // Objects
        ItemBox.preload(this);

        // Items
        Fireball.preload(this);
        Crate.preload(this);
        Spike.preload(this);
    }

    /**
     *
     */
    create() {
        this.physics.world.setBounds(0, 0, this.dimensions.x, this.dimensions.y);
        this.cameras.main.setBounds(0, 0, this.dimensions.x, this.dimensions.y);

        this.createAnimations();
        this.bindSocketEvents();

        this.createBackground();
        this.createLayers();
        this.createGroups();

        this.start();
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
        socket.on('enemyHit', this.onEnemyHit.bind(this));
        socket.on('enemyDied', this.onEnemyDied.bind(this));

        socket.on('itemUpdated', this.onItemUpdated.bind(this));
        socket.on('itemDestroyed', this.onItemDestroyed.bind(this));
    }

    /**
     *
     */
    createBackground() {
        this.background = this.add
            .tileSprite(
                this.dimensions.x / 2,
                this.dimensions.y / 2,
                this.dimensions.x,
                this.dimensions.y,
                'background'
            )
            .setScrollFactor(0.2);
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
        this.createSpikeGroup();
    }

    /**
     *
     */
    createCrateGroup() {
        this.groups.crates = this.physics.add.group({
            mass: 10,
            maxVelocity: 500,
            collideWorldBounds: false,
            dragX: 10000,
            velocityY: -100,
        });
    }

    /**
     *
     */
    createSpikeGroup() {
        this.groups.spikes = this.physics.add.group({
            mass: 10,
            maxVelocity: 500,
            collideWorldBounds: false,
            dragX: 10000,
            velocityY: -100,
        });
    }

    /**
     *
     */
    createItemBoxes() {
        for (let i = 0; i < 10; i++) {
            new ItemBox(this, {
                position: new Vector2(
                    70 + Math.random() * this.dimensions.x - 70 * 2,
                    70 + Math.random() * this.dimensions.y - 70 * 2
                ),
            });
        }
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

        for (const key of Object.keys(this.items)) {
            this.items[key].update();
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

        /**
         * @todo Let the server spawn these periodically instead.
         */
        this.createItemBoxes();
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
    getItem(id) {
        const item = this.items[id];

        if (!item) {
            throw new Error(`Item ${id} does not exist.`);
        }

        return item;
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
        this.addEnemyItem(data);
    }

    /**
     *
     */
    addEnemyItem(data) {
        switch (data.type) {
            case 'fireball':
                return this.addEnemyFireball(data);

            case 'crate':
                return this.addEnemyCrate(data);

            case 'spike':
                return this.addEnemySpike(data);
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
    addEnemySpike(data) {
        return new Spike(this, data);
    }

    /**
     * @todo Move to the specific class of item, so that it can decide what to
     * do.
     */
    onPlayerHit(item, playerSprite) {
        item.destroy();
        socket.emit('itemDestroyed', item.id);

        this.player.hitBy(item);
    }

    /**
     *
     */
    onItemUpdated(itemData) {
        try {
            const item = this.getItem(itemData.id);
            item.updatePosition(itemData.position);
        } catch (error) {
            console.warn('Failed to update item.', error);
        }
    }

    /**
     *
     */
    onItemDestroyed(id) {
        try {
            const item = this.getItem(id);
            item.destroy();
        } catch (error) {
            console.warn('Failed to destroy item.', error);
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
