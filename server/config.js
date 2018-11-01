const Rectangle = require('./math/Rectangle');

/**
 *
 */
const GRID_SIZE = 70;

/**
 *
 */
const playerOne = {
    character: 'player1',
    texture: 'player1',
    health: 10,
};

/**
 *
 */
const playerTwo = {
    character: 'player2',
    texture: 'player2',
    health: 10,
};

/**
 *
 */
const playerThree = {
    character: 'player3',
    texture: 'player3',
    health: 10,
};

/**
 *
 */
const playerFour = {
    character: 'player4',
    texture: 'player4',
    health: 10,
};

/**
 *
 */
const playerFive = {
    character: 'player5',
    texture: 'player5',
    health: 10,
};

/**
 *
 */
const players = [
    playerOne,
    playerTwo,
    playerThree,
    playerFour,
    playerFive,
];

/**
 *
 */
const levelOne = {
    name: 'LevelOne',
    bounds: Rectangle.origin(
        16 * GRID_SIZE,
        16 * GRID_SIZE
    ),
    players: {
        min: 1,
        max: 4,
    },
    loot: {
        interval: {
            min: 0,
            max: 10000,
        },
        spawns: 3,
    },
};

/**
 *
 */
const levelTwo = {
    name: 'LevelTwo',
    bounds: Rectangle.origin(
        32 * GRID_SIZE,
        32 * GRID_SIZE
    ),
    players: {
        min: 1,
        max: 8,
    },
    loot: {
        interval: {
            min: 0,
            max: 10000,
        },
        spawns: 5,
    },
};

/**
 *
 */
const levels = [
    levelOne,
    levelTwo,
];

module.exports = {
    GRID_SIZE,
    players,
    levels,
};
