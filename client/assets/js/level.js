class Level {
    constructor(scene, level) {
        this.scene = scene
        this.id = level.id

        this.background = null
        this.laag_platform = null
        this.laag_objecten = null
        this.laag_decoratie = null

        this.createLevel()
    }

    static preload(scene, id){
        // achtergrond
        scene.load.image('background', 'assets/img/background.png');

        // Tileset Wereld
        scene.load.image('tilesMain', 'assets/maps/tiles_spritesheet.png');

        scene.load.tilemapCSV(`lvl${id}_grond`, `assets/maps/lvl${id}/KillingFields_Platform.csv`);
        scene.load.tilemapCSV(`lvl${id}_objecten`, `assets/maps/lvl${id}/KillingFields_Objecten.csv`);
        scene.load.tilemapCSV(`lvl${id}_decoratie`, `assets/maps/lvl${id}/KillingFields_Decoratie.csv`);
    }

    createLevel(){
        // Tiles background
        this.background = this.scene.add.tileSprite(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 'background');
        
        this.createPlatforms();
    }

    createPlatforms() {
        // Tileset platform
        let tilemap_platform = this.scene.make.tilemap({ key: `lvl${this.id}_grond`, tileWidth: 70, tileHeight: 70});
        let tileset_platform = tilemap_platform.addTilesetImage('tilesMain');
        this.laag_platform = tilemap_platform.createDynamicLayer(0, tileset_platform, 0, 0); // layer index, tileset, x, y

        this.laag_platform.setCollisionBetween(1, 200);

        // Tileset objecten
        let tilemap_objecten = this.scene.make.tilemap({ key: `lvl${this.id}_objecten`, tileWidth: 70, tileHeight: 70});
        let tileset_objecten = tilemap_platform.addTilesetImage('tilesMain');
        this.laag_objecten = tilemap_objecten.createDynamicLayer(0, tileset_objecten, 0, 0); // layer index, tileset, x, y

        this.laag_objecten.setCollisionBetween(1, 200);
        this.makeObjectCollision()

        // Tileset decoratie
        let tilemap_decoratie = this.scene.make.tilemap({ key: `lvl${this.id}_decoratie`, tileWidth: 70, tileHeight: 70});
        let tileset_decoratie = tilemap_decoratie.addTilesetImage('tilesMain');
        this.laag_decoratie = tilemap_decoratie.createDynamicLayer(0, tileset_decoratie, 0, 0); // layer index, tileset, x, y
    };

    makeObjectCollision(){
        this.laag_objecten.forEachTile(function (tile) {
            if(tile.index !== -1){
                
            }
        },this);
    }

    // debug(boolean = false) {
    //     if(boolean){
    //         debugGraphics = this.scene.add.graphics();
    //         debugGraphics.clear();
    //         laag_platform.renderDebug(debugGraphics, { tileColor: null });
    //         laag_objecten.renderDebug(debugGraphics, { tileColor: null });
    //         laag_decoratie.renderDebug(debugGraphics, { tileColor: null });
    //     }
    // }
}
