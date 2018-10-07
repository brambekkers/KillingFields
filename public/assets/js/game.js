var config = {
    type: Phaser.AUTO,
    width: 1120,
    height: 1120,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 },
            debug: true
        }
    },
};

let game = new Phaser.Game(config);
let socket;
let platforms;
let players = [];
let cursors;

let laag_platform
let laag_objecten
let laag_decoratie

/**
 *
 */
function preload() {
    this.load.image('background', 'assets/img/background.png');
    this.load.spritesheet('player', 'assets/img/Player/p1_spritesheet.png', { frameWidth: 72.5 , frameHeight: 96});
    
    // Tileset Wereld
    this.load.image('tilesMain', 'assets/maps/lvl1/tiles_spritesheet.png');

    this.load.tilemapCSV('lvl1_grond', 'assets/maps/lvl1/KillingFields_Platform.csv');
    this.load.tilemapCSV('lvl1_objecten', 'assets/maps/lvl1/KillingFields_Objecten.csv');
    this.load.tilemapCSV('lvl1_decoratie', 'assets/maps/lvl1/KillingFields_Decoratie.csv');
}

/**
 *
 */
function create() {
    this.add.tileSprite(game.config.width/2, game.config.height/2, game.config.width, game.config.height, 'background');

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 14 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'jump',
        frames: [ { key: 'player', frame: 13 } ],
        frameRate: 20
    });

    bindSocketEvents.bind(this)();
    createPlatforms.bind(this)();

}

/**
 *
 */
function update() {
    for (const player of players) {
        player.update()
    }
}

/**
 *
 */
function createPlatforms() {
    // Tileset platform
    let tilemap_platform = this.make.tilemap({ key: 'lvl1_grond', tileWidth: 70, tileHeight: 70});
    let tileset_platform = tilemap_platform.addTilesetImage('tilesMain');
    laag_platform = tilemap_platform.createStaticLayer(0, tileset_platform, 0, 0); // layer index, tileset, x, y

    laag_platform.setCollisionBetween(1, 200);

    // Tileset platform
    let tilemap_objecten = this.make.tilemap({ key: 'lvl1_objecten', tileWidth: 70, tileHeight: 70});
    let tileset_objecten = tilemap_platform.addTilesetImage('tilesMain');
    laag_objecten = tilemap_objecten.createStaticLayer(0, tileset_objecten, 0, 0); // layer index, tileset, x, y

    laag_objecten.setCollisionBetween(1, 200);

    // Tileset decoratie
    let tilemap_decoratie = this.make.tilemap({ key: 'lvl1_decoratie', tileWidth: 70, tileHeight: 70});
    let tileset_decoratie = tilemap_decoratie.addTilesetImage('tilesMain');
    laag_decoratie = tilemap_decoratie.createStaticLayer(0, tileset_decoratie, 0, 0); // layer index, tileset, x, y



    // debug
        // debugGraphics = this.add.graphics();
        // debugGraphics.clear();
        // laag_platform.renderDebug(debugGraphics, { tileColor: null });
};

/**
 *
 */
function bindSocketEvents() {
    socket = io();

    socket.on('gameStarted', onGameStarted.bind(this));
    socket.on('playerJoined', onPlayerJoined.bind(this));
    socket.on('playerMoved', onPlayerMoved.bind(this));
    socket.on('playerLeft', onPlayerLeft.bind(this));
};

/**
 *
 */
function onGameStarted(allPlayers) {
    const me = addPlayer.bind(this)(allPlayers.self);
    me.cursors = this.input.keyboard.createCursorKeys();
    me.sprite.body.allowGravity = true;

    //collision
    this.physics.add.collider(me.sprite, [laag_platform, laag_objecten]);

    for (const player of allPlayers.others) {
        addPlayer.bind(this)(player);
    }
};

/**
 *
 */
function onPlayerJoined(player) {
    addPlayer.bind(this)(player);
};

/**
 *
 */
function onPlayerMoved(player) {
    const otherPlayer = players.filter(function (other) {
        return other.id === player.id;
    })[0];

    if (!otherPlayer) {
        return;
    }

    otherPlayer.setPosition(player);
};

/**
 *
 */
function onPlayerLeft(id) {
    players = players.filter((player)=>{
        if (player.id === id) {
            player.sprite.destroy();
        }

        return player.id !== id;
    })
};

/**
 *
 */
function addPlayer(data) {
    let player = createPlayer.bind(this)(data);
    players.push(player);

    return player;
};

/**
 *
 */
function createPlayer(data) {
    let player = new Player(this, data);
    this.physics.add.collider(player.sprite, platforms);

    return player;
};


