/**
 *
 */
export default class Lottery {
    /**
     * list of entries in the lottery.
     */
    entries = [];

    /**
     * Total number of lots in the pool.
     */
    pool = 0;

    /**
     *
     */
    constructor(entries = []) {
        this.entries = entries;
    }

    /**
     * Adds a new entry to the lottery,

     * @param {any} participant
     * @param {number} lots
     * @return {Lottery}
     */
    enter(participant, lots = 1) {
        this.entries.push({
            participant: participant,
            lots: lots,
        });

        this.pool += lots;

        return this;
    }

    /**
     * Determines the winner of the lottery based on the number of lots that
     * each participant has.

     * @returns {any}
     */
    draw() {
        if (this.pool <= 0) {
            return null;
        }

        const winningLot = Math.random() * this.pool;

        let currentLot = 0;
        for (const entry of this.entries) {
            currentLot += entry.lots;

            if (currentLot >= winningLot) {
                return entry.participant;
            }
        }

        return null;
    }
}
