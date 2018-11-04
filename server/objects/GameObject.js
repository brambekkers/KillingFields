const Vector2 = require('../math/Vector2');
const config = require('../config');
const uniqid = require('uniqid');


/**
 *
 */
class GameObject {
    /**
     *
     */
    constructor(room, data = {}) {
        data = {
            id: uniqid(),
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
