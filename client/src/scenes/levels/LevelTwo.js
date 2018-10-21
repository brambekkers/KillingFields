import Level from './Level';
import Vector2 from '../../math/Vector2';

/**
 *
 */
export default class LevelTwo extends Level {
    constructor(scene, data) {
        super("LevelTwo");

    }
    /**
     *
     */
    dimensions = new Vector2(
        32 * 70,
        32 * 70
    );

    /**
     *
     */
    preload() {
        super.preload();

        this.load.image('background', 'assets/img/background.png');

        this.load.tilemapCSV('platforms', 'assets/maps/lvl2/KillingFields_Platform.csv');
        this.load.tilemapCSV('objects', 'assets/maps/lvl2/KillingFields_Objecten.csv');
        this.load.tilemapCSV('decoration', 'assets/maps/lvl2/KillingFields_Decoratie.csv');
    }
}
