const GameObject = require('./GameObject');

/**
 *
 */
class Loot extends GameObject {
    /**
     *
     */
    toData() {
        return {
            ...super.toData(),
            type: 'loot',
        };
    }
}

module.exports = Loot;
