import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
import Player from '../../sprites/Player';
import Enemy from '../../sprites/Enemy';
import Loot from '../../sprites/Loot';
import Fireball from '../../sprites/items/Fireball';
import Crate from '../../sprites/items/Crate';
import Spike from '../../sprites/items/Spike';
import Trampoline from '../../sprites/items/Trampoline';

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
    loot = {};

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

        // Objects
        Loot.preload(this);

        // Items
        Fireball.preload(this);
        Crate.preload(this);
        Spike.preload(this);
        Trampoline.preload(this);
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
        this.configureCollider();

        this.start();
    }

    /**
     *
     */
    createAnimations() {
        Player.createAnimations(this);
    }

    /**
     *
     */
    bindSocketEvents() {
        window.socket.on('gameStarted', this.onGameStarted);

        window.socket.on('enemyJoined', this.onEnemyJoined);
        window.socket.on('enemyLeft', this.onEnemyLeft);
        window.socket.on('enemyMoved', this.onEnemyMoved);
        window.socket.on('itemCreated', this.onEnemyShoot);
        window.socket.on('enemyHit', this.onEnemyHit);
        window.socket.on('enemyDied', this.onEnemyDied);

        window.socket.on('itemUpdated', this.onItemUpdated);
        window.socket.on('itemDestroyed', this.onItemDestroyed);

        window.socket.on('lootCreated', this.onLootCreated);
        window.socket.on('lootDestroyed', this.onLootDestroyed);
    }

    /**
     *
     */
    createBackground() {
        this.background = this.add
            .image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(
                this.dimensions.x, 
                this.dimensions.y
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
        this.createTrampolineGroup();
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
    createTrampolineGroup() {
        this.groups.trampoline = this.physics.add.group({
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
    start() {
        window.socket.emit('start');
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
    onGameStarted = (game) => {
        this.addPlayer(game.player);

        for (const enemy of game.enemies) {
            this.addEnemy(enemy);
        }

        for (const item of game.items) {
            this.addEnemyItem(item);
        }

        for (const loot of game.loot) {
            this.addLoot(loot);
        }
    };

    getSolids(){
        return [
            ...this.getSolidLayers(),
            ...this.getSolidGroups()
        ];
    }

    /**
     *
     */
    getSolidLayers() {
        return [
            this.layers.platforms,
            this.layers.objects,
        ];
    }

    getSolidGroups() {
        return [
            this.groups.crates,
        ];
    }

    /**
     *
     */
    addPlayer(data) {
        this.player = new Player(this, data);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        return this.player;
    }

    /**
     *
     */
    onEnemyJoined = (data) => {
        this.addEnemy(data);
    };

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
    getLoot(id) {
        const loot = this.loot[id];

        if (!loot) {
            throw new Error(`Loot ${id} does not exist.`);
        }

        return loot;
    }


    
    configureCollider(){
        
        //collision box to eachother
        this.physics.add.collider(this.getSolidGroups(), this.getSolidGroups(), function (s1, s2) {

            let b1 = s1.body;
            let b2 = s2.body;

            if (b1.y > b2.y) {
                b2.y += (b1.top - b2.bottom);
                b2.stop();
            }
            else {
                b1.y += (b2.top - b1.bottom);
                b1.stop();
            }
        });
    }

    /**
     *
     */
    onEnemyMoved = (enemyData) => {
        try {
            const enemy = this.getEnemy(enemyData.id);

            enemy.updatePosition(enemyData.position);
            enemy.updateFacing(enemyData.flipX);
            enemy.updateAnimation(enemyData.animation);
        } catch (error) {
            console.warn('Failed to update enemy.', error);
        }
    };

    /**
     *
     */
    onEnemyLeft = (id) => {
        try {
            const enemy = this.getEnemy(id);

            enemy.destroy();
        } catch (error) {
            console.warn('Failed to remove enemy.', error);
        }
    };

    /**
     *
     */
    onEnemyShoot = (data) => {
        this.addEnemyItem(data);
    };

    /**
     *
     */
    addEnemyItem(data) {
        switch (data.type) {
            case 'fireball':
                return new Fireball(this, data);

            case 'crate':
                return new Crate(this, data);

            case 'spike':
                return new Spike(this, data);

            case 'trampoline':
                return new Trampoline(this, data);
        }
    }

    /**
     *
     */
    onItemUpdated = (itemData) => {
        try {
            const item = this.getItem(itemData.id);
            item.updatePosition(itemData.position);
        } catch (error) {
            console.warn('Failed to update item.', error);
        }
    };

    /**
     *
     */
    onItemDestroyed = (id) => {
        try {
            const item = this.getItem(id);
            item.destroy();
        } catch (error) {
            console.warn('Failed to destroy item.', error);
        }
    };

    /**
     *
     */
    onEnemyHit = (enemyData) => {
        try {
            const enemy = this.getEnemy(enemyData.id);
            enemy.updateHealth(enemyData.health);
        } catch (error) {
            console.warn('Failed to update enemy health.', error);
        }
    };

    /**
     *
     */
    onEnemyDied = (enemyData) => {
        try {
            let enemy = this.getEnemy(enemyData.id);
            enemy.destroy();
        } catch (error) {
            console.warn('Failed to destroy enemy.', error);
        }
    };

    /**
     *
     */
    onLootCreated = (lootData) => {
        this.addLoot(lootData)
    };

    /**
     *
     */
    addLoot(lootData) {
        new Loot(this, lootData);
    }

    /**
     *
     */
    onLootDestroyed = (lootId) => {
        try {
            let loot = this.getLoot(lootId);
            loot.destroy();
        } catch (error) {
            console.warn('Failed to destroy loot.', error);
        }
    };
}
