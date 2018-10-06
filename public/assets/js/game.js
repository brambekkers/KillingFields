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
let players = []


function preload (){
    
}

function create (){


    // Server handeling
    const socket = io();

    socket.on('playerJoined', (player)=>{
    
        // Maak nieuwe player
        console.log(player.id)
        let nieuwePlayer = new Player(this, player)
        players.push( nieuwePlayer )

    });


}

function update (){
    
}



