/**
 * @abstract
 */
class Level extends Scene {
    /**
     *
     */
    constructor(config) {
        super(config);

        this.initialize();
    }

    /**
     *
     */
    initialize() {
        this.layers = {};
        this.enemies = {};
        this.projectiles = {};
    }

    /**
     *
     */
    preload() {
        // Tilemap
        this.load.image('tiles', 'assets/maps/tiles_spritesheet.png');

        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

        Player.preload(this);
        Hud.preload(this);
        Fireball.preload(this);
        Crate.preload(this);
    }

    /**
     *
     */
    create() {
        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.createKeys();

        this.createBackground();
        this.createAnimations();
        this.createPlatforms();
        this.createObjects();
        this.createDecorations();

        this.bindSocketEvents();

        this.start();
    }

    /**
     *
     */
    createKeys() {
        window.cursors = this.input.keyboard.createCursorKeys();
        window.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        window.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        window.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        window.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        window.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
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
    createBackground() {
        this.background = this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'background');
    }

    /**
     *
     */
    createPlatforms() {
        this.layers.platforms = this
            .createLayer('platforms')
            .setCollisionBetween(1, 200);
    }

    /**
     *
     */
    createObjects() {
        this.layers.objects = this
            .createLayer('objects')
            .setCollisionBetween(1, 200);
    }

    /**
     *
     */
    createDecorations() {
        this.layers.decoration = this.createLayer('decoration');
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
        ];
    }

    /**
     *
     */
    addPlayer(data) {
        this.player = new Player(this, data);
        this.hud = new Hud(this);

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
        const enemy = new Enemy(this, data);

        this.enemies[enemy.id] = enemy;

        return enemy;
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
            enemy = undefined;
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

        this.physics.add.collider(fireball, player, onPlayerHit.bind(this));

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
            const projectile = this.getProjectile(id);

            projectile.disableBody(true, true);
            projectile = undefined;
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
            const enemy = this.getEnemy(enemyData.id);

            enemy.destroy();
            enemy = undefined;
        } catch (error) {
            console.warn('Failed to destroy enemy.', error);
        }
    }
}
