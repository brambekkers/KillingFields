/**
 *
 */
class LevelOne extends Level {
    /**
     *
     */
    preload() {
        super.preload();

        this.load.image('background', 'assets/img/background.png');

        this.load.tilemapCSV('platforms', 'assets/maps/lvl1/KillingFields_Platform.csv');
        this.load.tilemapCSV('objects', 'assets/maps/lvl1/KillingFields_Objecten.csv');
        this.load.tilemapCSV('decoration', 'assets/maps/lvl1/KillingFields_Decoratie.csv');
    }

    /**
     *
     */
    create() {
        this.createBackground();
        this.createPlatforms();
        this.createObjects();
        this.createDecorations();
    }

    /**
     *
     */
    createBackground() {
        this.background = this.add.tileSprite(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 'background');
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
}
