import Level from './Level';
import Vector2 from '../../math/Vector2';

/**
 *
 */
export default class LevelOne extends Level {
    /**
     *
     */
    dimensions = new Vector2(
        16 * 70,
        16 * 70
    );

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
}
