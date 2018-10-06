var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
let platforms;
let players = [];

/**
 *
 */
function preload() {
    this.load.image('player', 'assets/img/Player/p1_front.png');
    this.load.image('grassMid', 'assets/img/Tiles/grassMid.png');
}

function create() {
    createPlatforms.bind(this)();
    bindSocketEvents.bind(this)();
}

function update() {

}

function createPlatforms() {
    platforms = this.physics.add.staticGroup();

    for (let x = 35; x <= config.width + 35; x += 70) {
        platforms.create(x, config.height - 35, 'grassMid');
    }
};

function bindSocketEvents() {
    const socket = io();

    socket.on('gameStarted', onGameStarted.bind(this));
    socket.on('playerJoined', onPlayerJoined.bind(this));
    socket.on('playerLeft', onPlayerLeft.bind(this));
};

function onGameStarted(allPlayers) {
    addPlayer.bind(this)(this, allPlayers.self);

    for (const player of allPlayers.others) {
        addPlayer.bind(this)(this, player);
    }
};

function onPlayerJoined(player) {
    addPlayer.bind(this)(this, player);
};

function onPlayerLeft(id) {
    players = players.filter((player)=>{
        if (player.id === id) {
            // this.destroy(player.scenecircle);
        }

        return player.id !== id;
    })
};

function addPlayer(data) {
    let player = createPlayer.bind(this)(data);
    players.push(player);

    return player;
};

function createPlayer(data) {
    let player = new Player(this, data);
    this.physics.add.collider(player.sprite, platforms);

    return player;
};
