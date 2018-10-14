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

        this.scene.physics.add.collider(this, [
            ...this.scene.getSolids(),
            this.scene.player,
        ]);

        this.scene.groups.crates.add(this);
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
     *
     */
    static use(player) {
        const position = new Vector2(player.x, player.y);
        const direction = new Vector2(player.flipX ? -1 : 1, 0).normalize();

        const crate = new Crate(player.scene, {
            position: position.add(direction.multiply(70)),
        });

        socket.emit('shoot', crate.toData());
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
