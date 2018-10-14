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

        this.projectileCooldown = 0;
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

        this.limit();

        this.coolDown();

        if (cursors.space.isDown) {
            this.shoot();
        }
    }

    /**
     *
     */
    move() {
        if (cursors.left.isDown || keyA.isDown) {
            this.setVelocityX(-400);
            this.anims.play(`${this.character}_walk`, true);
            this.flipX = true;
        } else if (cursors.right.isDown || keyD.isDown) {
            this.setVelocityX(400);
            this.anims.play(`${this.character}_walk`, true);
            this.flipX = false;
        } else {
            this.setVelocityX(0);
            this.anims.play(`${this.character}_turn`);
        }

        if (
            cursors.space.isDown &&
            this.body.blocked.down
        ) {
            this.setVelocityY(-1000);
        } else if (
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

        if(cursors.down.isUp && keyS.isUp){
            this.setSize(50, 94)
            this.displayOriginY = 48
        }

        if (!this.body.blocked.down) {
            this.anims.play(`${this.character}_jump`);
        }

        socket.emit('move', this.toData());
    }

    /**
     *
     */
    limit() {
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
        this.projectileCooldown--;
    }

    /**
     *
     */
    shoot() {
        if (this.projectileCooldown > 0) {
            return;
        }

        // const projectile = this.createFireball();
        const projectile = this.createCrate();

        socket.emit('shoot', projectile.toData());

        this.projectileCooldown = projectile.cooldown;
    }

    /**
     * @todo Sould the server determine whether the player died instead?
     */
    hitBy(projectile) {
        projectile.disableBody(true, true);
        delete projectiles[projectile.id];

        socket.emit('projectileDestroyed', projectile.id);

        this.health -= projectile.damage;

        if (this.health > 0) {
            socket.emit('hit', projectile.damage);
            hud.heartHealth.play(`heartHealth${this.health}`, true);
        } else {
            this.die();
        }
    }

    /**
     *
     */
    die() {
        this.disableBody(true, true);
        player = undefined;

        socket.emit('died');
    }

    /**
     *
     */
    createFireball() {
        const position = new Vector2(this.x, this.y);
        const direction = new Vector2(this.flipX ? -1 : 1, 0).normalize();

        return new Fireball(this.scene, {
            position: position.add(direction.multiply(20)),
            velocity: direction.setMagnitude(500),
        });
    }

    /**
     *
     */
    createCrate() {
        const position = new Vector2(this.x, this.y);
        const direction = new Vector2(this.flipX ? -1 : 1, 0).normalize();

        return new Crate(this.scene, {
            position: position.add(direction.multiply(70)),
        });
    }
}
