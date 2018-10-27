import Scene from '../Scene';
import Vector2 from '../../math/Vector2';
// import Hud from '../../Hud';
import Player from '../../sprites/Player';
import Enemy from '../../sprites/Enemy';
import Fireball from '../../sprites/items/Fireball';
import Crate from '../../sprites/items/Crate';
import Spike from '../../sprites/items/Spike';
import Trampoline from '../../sprites/items/Trampoline';
import ArcadeSprite from '../../sprites/ArcadeSprite';

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

        // Player
        Player.preload(this);
        // Hud.preload(this);

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

        this.createBackground();
        this.createLayers();
        this.createGroups();
        this.configureCollider();

        this.createAnimations();

        this.bindSocketEvents();

        this.start();
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
            .setScrollFactor(0);
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
    createAnimations() {
        Player.createAnimations(this);
        // Hud.createAnimations(this);
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

            case 'spike':
                return this.addEnemySpike(data);

            case 'trampoline':
                return this.addEnemyTrampoline(data);
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
     *
     */
    addEnemyTrampoline(data) {
        return new Trampoline(this, data);
    }

    /**
     * @todo Move to the specific class of item, so that it can decide what to
     * do.
     */
    onPlayerHit(projectile, playerSprite) {
        projectile.destroy();
        socket.emit('projectileDestroyed', projectile.id);

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
