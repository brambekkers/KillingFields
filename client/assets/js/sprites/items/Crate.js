/**
 *
 */
class Crate extends ArcadeItem {
    /**
     *
     */
    constructor(scene, data) {
        super(scene, Object.assign(data, {
            texture: Crate.randomTexture(),
        }));

        this.cooldown = 30;

        this.scene.physics.add.collider(this, this.scene.player);
        this.scene.physics.add.collider(this, this.scene.getSolids());
    }

    /**
     *
     */
    static randomTexture(){
        const number = Math.floor(Math.random() * 3);

        return `crate${number}`;
    }

    /**
     *
     */
    static preload(scene) {
        scene.load.image('crate0', 'assets/img/Tiles/box.png');
        scene.load.image('crate1', 'assets/img/Tiles/boxEmpty.png');
        scene.load.image('crate2', 'assets/img/Tiles/boxAlt.png');
    }

    /**
     * Returns the data representation of this instance, so that it can be sent
     * to the server.
     */
    toData() {
        return Object.assign(super.toData(), {
            type: 'crate',
        });
    }
}
