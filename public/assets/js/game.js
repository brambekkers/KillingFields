const GAME_WIDTH = 1120;
const GAME_HEIGHT = 1120;

var config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1500,
            },
            debug: true,
        },
    },
};

let game = new Phaser.Game(config);
let level;
let socket;
let player;
let cursors;

let enemies = {};
let projectiles = {};

let projectileGroup;
let enemyProjectileGroup;

/**
 *
 */
function preload() {
    // Player
    this.load.spritesheet('player1', 'assets/img/Player/player1.png', { frameWidth: 73, frameHeight: 96});
    this.load.spritesheet('player2', 'assets/img/Player/player2.png', { frameWidth: 73, frameHeight: 96});
    this.load.spritesheet('player3', 'assets/img/Player/player3.png', { frameWidth: 73, frameHeight: 96});

    this.load.image('fireball', 'assets/img/Items/fireball.png');

    // Fonts
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

    // create lvl en preload images
    level = new Level(this,  {id: 1})
}

/**
 *
 */
function create() {
    this.add.tileSprite(game.config.width/2, game.config.height/2, game.config.width, game.config.height, 'background');
    level.createLevel()

    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    cursors = this.input.keyboard.createCursorKeys();

    createAnimations.bind(this)();
    createProjectiles.bind(this)();

    bindSocketEvents.bind(this)();

    // fonts
    var add = this.add;
    var input = this.input;
    WebFont.load({
        google: {
            families: ['Knewave']
        },
        active: function (){
            if(player){
                player.healthText.setFontFamily("Knewave")
                player.healthText.setShadow(2, 2, "#333333", 2, false, true);
            }
        }
    });
}

/**
 *
 */
function update() {
    if (player) {
        player.update();
    }
}

/**
 *
 */
function createAnimations() {
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
}

/**
 *
 */
function createProjectiles() {
	projectileGroup = this.physics.add.group();
	enemyProjectileGroup = this.physics.add.group();
}

/**
 *
 */
function bindSocketEvents() {
    socket = io();

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
function onGameStarted(game) {
    addPlayer.bind(this)(game.player);

    for (const enemy of game.enemies) {
        addEnemy.bind(this)(enemy);
    }
};

/**
 *
 */
function addPlayer(data) {
    player = new Player(this, data);

    this.physics.add.collider(player.sprite, [level.laag_platform, level.laag_objecten]);
    // this.cameras.main.startFollow(player.sprite);

    return player;
};

/**
 *
 */
function onEnemyJoined(enemy) {
    addEnemy.bind(this)(enemy);
};

/**
 *
 */
function addEnemy(data) {
    enemies[data.id] = new Enemy(this, data);

    return enemies[data.id];
};

/**
 *
 */
function getEnemy(id) {
    const enemy = enemies[id];

    if (!enemy) {
        throw new Error(`Enemy ${id} does not exist.`);
    }

    return enemy;
}

/**
 *
 */
function getProjectile(id) {
    const projectile = projectiles[id];

    if (!projectile) {
        throw new Error(`Projectile ${id} does not exist.`);
    }

    return projectile;
}

/**
 *
 */
function onEnemyMoved(enemyData) {
    try {
        const enemy = getEnemy(enemyData.id);

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
function onEnemyLeft(id) {
    try {
        const enemy = getEnemy(id);

        enemy.sprite.destroy();
        delete enemy;
    } catch (error) {
        console.warn('Failed to remove enemy.');
    }
};

/**
 *
 */
function onEnemyShoot(data) {
    const projectile = enemyProjectileGroup
        .create(
            data.x,
            data.y,
            'fireball'
        )
        .setBounce(1);

    projectile.id = data.id;
    projectile.damage = data.damage;
    projectile.flipX = data.flipX;

    projectile.body.velocity.x = data.body.velocity.x;
    projectile.body.velocity.y = data.body.velocity.y;
    projectile.body.width = 20;
    projectile.body.height = 20;
    projectile.body.setOffset(25, 25);

    this.physics.add.collider(projectile, [level.laag_platform, level.laag_objecten]);

    if (player) {
        this.physics.add.collider(projectile, player.sprite, onPlayerHit);
    }

    projectiles[projectile.id] = projectile;
}

/**
 *
 */
onPlayerHit = (projectile, playerSprite) => {
    player.hitBy(projectile);
}

/**
 *
 */
function onProjectileDestroyed(id) {
    try {
        const projectile = getProjectile(id);

        projectile.disableBody(true, true);
        delete projectile;
    } catch (error) {
        console.warn('Failed to destroy projectile.');
    }
}

/**
 *
 */
function onEnemyHit(enemyData) {
    try {
        const enemy = getEnemy(enemyData.id);

        enemy.setHealth(enemyData.health);
    } catch (error) {
        console.warn('Failed to update enemy health.');
    }
}

/**
 *
 */
function onEnemyDied(enemyData) {
    try {
        const enemy = getEnemy(enemyData.id);

        enemy.sprite.destroy();
        delete enemy;
    } catch (error) {
        console.warn('Failed to destroy enemy.');
    }
}
