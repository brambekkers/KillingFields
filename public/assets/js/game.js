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

    ////////////////////////////////////////////
    //////////// Server handeling //////////////
    ////////////////////////////////////////////
    const socket = io();

    // Game start
    socket.on('gameStarted', (allPlayers)=>{
        console.log("Alle Players toegevoegd")

        // Push zelf
        players.push( new Player(this, allPlayers.self) )

        // Push alle anderen
        for (const player of allPlayers.others) {
            players.push( new Player(this, player) )
        }
    });

    // Er komst een player bij
    socket.on('playerJoined', (player)=>{
        console.log("Player joined the game")
        // Maak nieuwe player
        let nieuwePlayer = new Player(this, player)
        players.push( nieuwePlayer )
    });

    // Player verlaat het spel
    socket.on('playerLeft', (id)=>{
        players = players.filter((player)=>{

            if(player.id === id){
                player.circle.destroy();
            }

            return player.id != id;
        })
    });


}

function update (){
    
}



