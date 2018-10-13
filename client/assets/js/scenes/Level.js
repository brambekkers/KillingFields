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
        this.create();
    }

    /**
     *
     */
    initialize() {
        this.enemies = {};
        this.projectiles = {};
    }

    /**
     * @abstract
     */
    create() {}

    /**
     *
     */
    createLayer(tileMapKey, tileWidth = 70, tileHeight = 70) {
        const tilemap = this.make.tilemap({
            key,
            tileWidth,
            tileHeight,
        });

        const tileset = tilemap_platform.addTilesetImage('tiles');

        return tilemap.createDynamicLayer(0, tileset, 0, 0);
    }



















    /**
     *
     */
    preload() {
        // Tilemap
        this.load.image('tiles', 'assets/maps/tiles_spritesheet.png');

        // Player
        for (let i = 1; i <= 3; i++) {
            this.load.spritesheet(`player${i}`, `assets/img/Player/player${i}.png`, { frameWidth: 73, frameHeight: 96});
        }

        // Items
        this.load.image('fireball', 'assets/img/Items/fireball.png');

        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

        // Level.preload(this, 2)
        Hud.preload(this)
    }

    /**
     *
     */
    create() {
        // // create lvl en preload images
        // level = new Level(this,  {id: 2})

        this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

        window.cursors = this.input.keyboard.createCursorKeys();

        this.createAnimations();
        this.createProjectiles();

        this.bindSocketEvents();

        // // font
        // WebFont.load({
        //     google: {
        //         families: ['Knewave']
        //     },
        //     active: (){
        //         if(player){
        //         }
        //     }
        // });
    }

    /**
     *
     */
    update() {
        if (this.player) {
            this.player.update();
        }
    }

    /**
     *
     */
    createAnimations() {
        for (let i = 1; i <= 3; i++) {
            this.anims.create({
                key: `player${i}_walk`,
                frames: this.anims.generateFrameNumbers(`player${i}`, { start: 0, end: 4 }),
                frameRate: 15,
                repeat: -1
            });

            this.anims.create({
                key: `player${i}_turn`,
                frames: [ { key: `player${i}`, frame: 9 } ],
                frameRate: 20
            });

            this.anims.create({
                key: `player${i}_jump`,
                frames: [ { key: `player${i}`, frame: 13 } ],
                frameRate: 20
            });

            this.anims.create({
                key: `player${i}_duck`,
                frames: [ { key: `player${i}`, frame: 11 } ],
                frameRate: 20
            });
        }

        for (let i = 0; i <= 11; i++) {
            this.anims.create({
                key: `heartHealth${i}`,
                frames: this.anims.generateFrameNumbers('heartHealth', { start: `${i}`, end: `${i}`}),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    /**
     *
     */
    createProjectiles() {
    	window.projectileGroup = this.physics.add.group();
    	window.enemyProjectileGroup = this.physics.add.group();
    }

    /**
     *
     */
    bindSocketEvents() {
        socket.on('gameStarted', onGameStarted.bind(this));
        socket.on('enemyJoined', onEnemyJoined.bind(this));
        socket.on('enemyLeft', onEnemyLeft.bind(this));
        socket.on('enemyMoved', onEnemyMoved.bind(this));
        socket.on('enemyShot', onEnemyShoot.bind(this));
        socket.on('projectileDestroyed', onProjectileDestroyed.bind(this)); // TODO: Should be part of onEnemyHit.
        socket.on('enemyHit', onEnemyHit.bind(this));
        socket.on('enemyDied', onEnemyDied.bind(this));
    };

    /**
     *
     */
    onGameStarted(game) {
        this.addPlayer(game.player);

        for (const enemy of game.enemies) {
            this.addEnemy(enemy);
        }
    };

    /**
     *
     */
    addPlayer(data) {
        this.player = new Player(this, data);
        this.hud = new Hud(this);

        this.physics.add.collider(player, [
            this.platformLayer,
            this.objectLayer,
        ]);

        // camera
        this.cameras.main.startFollow(player);
        this.cameras.main.setZoom(1);

        return this.player;
    };

    /**
     *
     */
    onEnemyJoined(data) {
        this.addEnemy(data);
    };

    /**
     *
     */
    addEnemy(data) {
        const enemy = new Enemy(this, data);

        this.enemies[data.id] = enemy;

        return enemy;
    };

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

            const { x, y } = enemyData;
            enemy.setPosition(x, y);

            const { animation, looping, flipX } = enemyData;
            enemy.setAnimation(animation, looping, flipX);
        } catch (error) {
            console.warn('Failed to update enemy.');
        }
    };

    /**
     *
     */
    onEnemyLeft(id) {
        try {
            const enemy = this.getEnemy(id);

            enemy.destroy();
            enemy = undefined;
        } catch (error) {
            console.warn('Failed to remove enemy.');
        }
    };

    /**
     *
     */
    onEnemyShoot(data) {
        this.addProjectile(data);
    }

    /**
     *
     */
    addProjectile(data) {
        switch (data.type) {
            default:
            case 'fireball':
                return this.addFireball(data);
        }
    }

    /**
     *
     */
    addFireball(data) {
        const fireball = window.enemyProjectileGroup
            .create(
                data.x,
                data.y,
                'fireball'
            )
            .setBounce(1);

        fireball.id = data.id;
        fireball.damage = data.damage;
        fireball.flipX = data.flipX;

        fireball.body.velocity.x = data.body.velocity.x;
        fireball.body.velocity.y = data.body.velocity.y;
        fireball.body.width = 20;
        fireball.body.height = 20;
        fireball.body.setOffset(25, 25);

        this.physics.add.collider(fireball, [level.laag_platform, level.laag_objecten]);

        if (player) {
            this.physics.add.collider(fireball, player, onPlayerHit.bind(this));
        }

        this.projectiles[fireball.id] = fireball;

        return fireball;
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
            console.warn('Failed to destroy projectile.');
        }
    }

    /**
     *
     */
    onEnemyHit(enemyData) {
        try {
            const enemy = this.getEnemy(enemyData.id);

            enemy.setHealth(enemyData.health);
        } catch (error) {
            console.warn('Failed to update enemy health.');
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
            console.warn('Failed to destroy enemy.');
        }
    }
}
