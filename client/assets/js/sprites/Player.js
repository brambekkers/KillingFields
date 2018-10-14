/**
 *
 */
class Player extends ArcadeSprite {
    /**
     *
     */
    constructor(scene, data) {
        super(scene, data.x, data.y, data.character);

        this.id = data.id;
        this.characterNum = data.characterNum;
        this.character = data.character;
        this.health = data.health;
        this.kills = 1

        this.setSize(50, 94, true)
        this.flipX = data.flipX;
        this.anims.play(data.animation, data.looping);

        this.projectileCooldown = 0;
        this.itemCooldown = 0;

        this.flipX = data.flipX;
        this.anims.play(data.animation, data.looping);
    }

    /**
     *
     */
    update() {
        this.move();

        // max Velocity (zodat we te snel gaan en door de grond)
        var standing = this.body.blocked.down || this.body.touching.down;
        if (!standing && this.body.velocity.y > 800) {
            this.setVelocityY(600)
        }

        // Shooting
        this.projectileCooldown--;
        if (keyE.isDown) {
            this.shoot();
        }
        // Drop item
        this.itemCooldown--;
        if (keyF.isDown) {
            this.createCrate()
        }
    }

    /**
     *
     */
    move() {
        // move left
        if (cursors.left.isDown || keyA.isDown) {
            this.setVelocityX(-300);
            this.anims.play(`${this.character}_walk`, true);
            this.flipX = true;
        }
         // move right 
        else if (cursors.right.isDown || keyD.isDown) {
            this.setVelocityX(300);
            this.anims.play(`${this.character}_walk`, true);
            this.flipX = false;
        } 
         // Reset player
        else {
            this.setVelocityX(0);
            this.anims.play(`${this.character}_turn`);
        }

        // Player jump
        if (
            cursors.space.isDown &&
            (this.body.blocked.down || this.body.touching.down)
        ) {
            this.setVelocityY(-1000);
        } 
        // Player duck
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

        if(cursors.down.isUp && keyS.isUp){
            this.setSize(50, 94)
            this.displayOriginY = 48
        }

        if (!this.body.blocked.down && !this.body.touching.down) {
            this.anims.play(`${this.character}_jump`);
        }

        socket.emit('move', {
            x: this.x,
            y: this.y,
            animation: this.anims.currentAnim.key,
            looping: this.anims.currentAnim.repeat,
            flipX: this.flipX,
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

        const direction = this.flipX ? -1 : 1;

        const projectile = projectileGroup
            .create(
                this.x + 20 * direction,
                this.y,
                'fireball'
            )
            .setBounce(1);

        projectile.id = new Date().getTime(); // TODO: Use a better ID.
        projectile.damage = 1;
        projectile.flipX = this.flipX;
        projectile.body.velocity.x = 500 * direction;
        projectile.body.width = 20;
        projectile.body.height = 20;
        projectile.body.setOffset(25, 25);

        this.scene.physics.add.collider(projectile, [
            level.laag_platform,
            level.laag_objecten,
        ]);

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
    createCrate(){
        if (this.itemCooldown > 0) {
            return;
        }

        this.itemCooldown = 20;

        let crate = new Crate(this.scene, this.x, this.y)

        crateGroup.add(crate)

        this.scene.physics.add.collider(crateGroup, [
            level.laag_platform,
            level.laag_objecten,
            player,
            crate
        ]);
        // this.scene.physics.add.collider(crate, crateGroup);

        
    }
}
