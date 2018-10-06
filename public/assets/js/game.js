var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 512,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
};

let game = new Phaser.Game(config);
let socket;
let platforms;
let players = [];
let cursors;

/**
 *
 */
function preload() {
    this.load.spritesheet('player', 'assets/img/Player/p1_spritesheet.png', { frameWidth: 73 , frameHeight: 96});
    this.load.image('grassMid', 'assets/img/Tiles/grassMid.png');
}

/**
 *
 */
function create() {
    createPlatforms.bind(this)();
    bindSocketEvents.bind(this)();
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
    platforms = this.physics.add.staticGroup();

    for (let x = 35; x <= config.width + 35; x += 70) {
        platforms.create(x, config.height - 35, 'grassMid');
    }
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
    const me = addPlayer.bind(this)(this, allPlayers.self);
    me.cursors = this.input.keyboard.createCursorKeys();

    for (const player of allPlayers.others) {
        addPlayer.bind(this)(this, player);
    }
};

/**
 *
 */
function onPlayerJoined(player) {
    addPlayer.bind(this)(this, player);
};

/**
 *
 */
function onPlayerMoved(player) {
    const otherPlayer = players.filter(function (other) {
        console.log(other, player);
        return other.id === player.id;
    })[0];

    // console.log('otherPlayer', otherPlayer);

    if (!otherPlayer) {
        return;
    }

    otherPlayer.setPosition(player.x, player.y);
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
