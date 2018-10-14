/**
 *
 */
class Player extends ArcadeSprite {
    /**
     *
     */
    constructor(scene, data) {
        super(scene, data);

        this.character = data.character;
        this.health = data.health;
        this.kills = 0;

        this.setSize(50, 94, true);

        this.cooldowns = {
            primary: 0,
            secondary: 0,
        };

        this.PrimaryItem = Fireball;
        this.SecondaryItem = Crate;
    }

    /**
     *
     */
    static preload(scene) {
        for (let i = 1; i <= 3; i++) {
            scene.load.spritesheet(`player${i}`, `assets/img/Player/player${i}.png`, {
                frameWidth: 73,
                frameHeight: 96,
            });
        }
    }

    /**
     *
     */
    static createAnimations(scene) {
        for (let i = 1; i <= 3; i++) {
            scene.anims.create({
                key: `player${i}_walk`,
                frames: scene.anims.generateFrameNumbers(`player${i}`, { start: 0, end: 4 }),
                frameRate: 15,
                repeat: -1
            });

            scene.anims.create({
                key: `player${i}_turn`,
                frames: [ { key: `player${i}`, frame: 9 } ],
                frameRate: 20
            });

            scene.anims.create({
                key: `player${i}_jump`,
                frames: [ { key: `player${i}`, frame: 13 } ],
                frameRate: 20
            });

            scene.anims.create({
                key: `player${i}_duck`,
                frames: [ { key: `player${i}`, frame: 11 } ],
                frameRate: 20
            });
        }
    }

    /**
     *
     */
    update() {
        this.move();
        this.limitMovement();

        this.coolDown();
        this.useItems();
    }

    /**
     * @todo Separate animations from movement logic.
     */
    move() {
        // Move left.
        if (cursors.left.isDown || keyA.isDown) {
            this.setVelocityX(-400);
            this.anims.play(`${this.character}_walk`, true);
            this.flipX = true;
        }
        // Move right.
        else if (cursors.right.isDown || keyD.isDown) {
            this.setVelocityX(400);
            this.anims.play(`${this.character}_walk`, true);
            this.flipX = false;
        }
        // Idle.
        else {
            this.setVelocityX(0);
            this.anims.play(`${this.character}_turn`);
        }

        // Jumping.
        if (
            cursors.space.isDown &&
            (this.body.blocked.down || this.body.touching.down)
        ) {
            this.setVelocityY(-1000);
        }

        // Ducking.
        else if (
            cursors.down.isDown &&
            this.body.blocked.down &&
            cursors.right.isUp &&
            cursors.left.isUp ||
            keyS.isDown &&
            this.body.blocked.down &&
            cursors.right.isUp &&
            cursors.left.isUp
        ) {
            this.anims.play(`${this.character}_duck`);
            this.setSize(50, 65);
            this.displayOriginY = 60
        }
        // Standing up.
        else if (cursors.down.isUp && keyS.isUp) {
            this.setSize(50, 94)
            this.displayOriginY = 48
        }

        if (!this.body.blocked.down && !this.body.touching.down) {
            this.anims.play(`${this.character}_jump`);
        }

        socket.emit('move', this.toData());
    }

    /**
     *
     */
    limitMovement() {
        const standing = (
            this.body.blocked.down ||
            this.body.touching.down
        );

        const limitExceeded = this.body.velocity.y > 600;

        if (!standing && limitExceeded) {
            this.setVelocityY(600);
        }
    }

    /**
     *
     */
    coolDown() {
        this.cooldowns.primary--;
        this.cooldowns.secondary--;
    }

    /**
     *
     */
    useItems() {
        if (keyF.isDown) {
            this.usePrimaryItem();
        }

        if (keyE.isDown) {
            this.useSecondaryItem();
        }
    }

    /**
     *
     */
    usePrimaryItem() {
        if (
            !this.PrimaryItem ||
            this.cooldowns.primary > 0
        ) {
            return;
        }

        this.PrimaryItem.use(this);

        this.cooldowns.primary = this.PrimaryItem.cooldown;
    }

    /**
     *
     */
    useSecondaryItem() {
        if (
            !this.SecondaryItem ||
            this.cooldowns.secondary > 0
        ) {
            return;
        }

        this.SecondaryItem.use(this);

        this.cooldowns.secondary = this.SecondaryItem.cooldown;
    }

    /**
     * @todo Sould the server determine whether the player died instead?
     */
    hitBy(projectile) {
        projectile.disableBody(true, true);
        delete this.scene.projectiles[projectile.id];

        socket.emit('projectileDestroyed', projectile.id);

        this.health -= projectile.damage;

        if (this.health > 0) {
            socket.emit('hit', projectile.damage);
            // hud.heartHealth.play(`heartHealth${this.health}`, true);
        } else {
            this.die();
        }
    }

    /**
     *
     */
    die() {
        this.disableBody(true, true);
        this.scene.player = undefined;

        socket.emit('died');
    }
}
