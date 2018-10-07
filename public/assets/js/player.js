/**
 *
 */
class Player {
    /**
     *
     */
    constructor(scene, data) {
        this.scene = scene;

        this.id = data.id;
        this.health = data.health;

        this.sprite = this.scene.physics.add.sprite(data.x, data.y, 'player');
        this.sprite.flipX = data.flipX;
        this.sprite.anims.play(data.animation, data.looping);

        this.projectileCooldown = 0;
    }

    /**
     *
     */
    update() {
        this.move();

        this.projectileCooldown--;

        if (cursors.space.isDown) {
            this.shoot();
        }
    }

    /**
     *
     */
    move() {
        if (cursors.left.isDown) {
            this.sprite.setVelocityX(-300);
            this.sprite.anims.play('left', true);
            this.sprite.flipX = true;
        } else if (cursors.right.isDown) {
            this.sprite.setVelocityX(300);
            this.sprite.anims.play('right', true);
            this.sprite.flipX = false;
        } else {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play('turn');
        }

        if (cursors.up.isDown && this.sprite.body.touching.down) {
            this.sprite.setVelocityY(-600);
        } else if (cursors.down.isDown) {
            this.sprite.setVelocityY(600);
        }

        if (!this.sprite.body.touching.down) {
            this.sprite.anims.play('jump');
        }

        socket.emit('move', {
            x: this.sprite.x,
            y: this.sprite.y,
            animation: this.sprite.anims.currentAnim.key,
            looping: this.sprite.anims.currentAnim.repeat,
            flipX: this.sprite.flipX,
        });
    }

    /**
     *
     */
    shoot() {
        if (this.projectileCooldown > 0) {
            return;
        }

        this.projectileCooldown = 30;

        const direction = this.sprite.flipX ? -1 : 1;

        const projectile = projectileGroup
            .create(
                this.sprite.x + 20 * direction,
                this.sprite.y,
                'fireball'
            )
            .setBounce(1);

        projectile.id = new Date().getTime(); // TODO: User a better ID.
        projectile.damage = 1;
        projectile.flipX = this.sprite.flipX;
        projectile.body.velocity.x = 500 * direction;
        projectile.body.width = 20;
        projectile.body.height = 20;
        projectile.body.setOffset(25, 25);

        this.scene.physics.add.collider(projectile, platforms);

        projectiles[projectile.id] = projectile;

        socket.emit('shoot', {
            id: projectile.id,
            damage: projectile.damage,
            flipX: projectile.flipX,
            x: projectile.x,
            y: projectile.y,
            body: {
                velocity: {
                    x: projectile.body.velocity.x,
                    y: projectile.body.velocity.y,
                },
            },
        });
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
        } else {
            this.die();
        }
    }

    /**
     *
     */
    die() {
        this.sprite.disableBody(true, true);
        player = undefined;

        socket.emit('died');
    }
}
