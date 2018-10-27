const Vector2 = require('../math/Vector2');
const config = require('../config');

/**
 *
 */
class GameObject {
    /**
     *
     */
    constructor(room, data = {}) {
        data = {
            id: new Date().getTime(), // TODO: Use better IDs.
            position: room.level.bounds
                .expand(-config.GRID_SIZE)
                .getRandomPosition(),
            ...data
        };

        this.room = room;

        this.id = data.id;
        this.position = data.position;
    }

    /**
     *
     */
    toData() {
        return {
            id: this.id,
            position: this.position,
        };
    }
}

module.exports = GameObject;
