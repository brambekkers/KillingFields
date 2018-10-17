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
        this.items = ['crate', 'spike', 'crate']

        this.setSize(50, 94, true)
        this.flipX = data.flipX;
        this.anims.play(data.animation, data.looping);

        this.projectileCooldown = 0;
        this.itemCooldown = 0;
        this.spikeHitCooldown = 0;

        this.flipX = data.flipX;
        this.anims.play(data.animation, data.looping);
    }

    /**
     *
     */
    update() {
        this.move();
        this.cooldown()

        // Shooting
        if (keyE.isDown) {
            this.shoot();
        }

        // Drop item
        if (keyF.isDown) {
            this.shootItem()
        }
    }

    cooldown(){
        // Shooting
        this.projectileCooldown--;

        // Spike
        this.spikeHitCooldown--;

        // Drop item
        this.itemCooldown--;
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

    shootItem(){
        // cooldown
        if (this.itemCooldown > 0) {
            return;
        }
        this.itemCooldown = 30;


        let shoot = false

        if(player.items[0] === 'crate'){
            this.createCrate()
            shoot = true
        }
        if(player.items[0] === 'spike'){
            this.createSpike()
            shoot = true
        }

        if(shoot){
            player.items.shift()
            hud.updateItemBox()
        }

    }

    /**
     * @todo Sould the server determine whether the player died instead?
     */
    hitBy(projectile) {
        projectile.disableBody(true, true);
        delete projectiles[projectile.id];

        socket.emit('projectileDestroyed', projectile.id);

        this.dealDmg(projectile)
    }

    dealDmg(source){
        this.health -= source.damage;

        if (this.health > 0) {
            socket.emit('hit', source.damage);
        } else {
            this.die();
        }
        
        hud.heartHealth.play(`heartHealth${this.health}`, true);
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
        // Create new crate and add to group
        crateGroup.add(new Crate(this.scene, this.x-10, this.y))

        //collision box to eachother
        this.scene.physics.add.collider(crateGroup, crateGroup, function (s1, s2) {
            let b1 = s1.body;
            let b2 = s2.body;
    
            if (b1.y > b2.y) {
                b2.y += (b1.top - b2.bottom);
                b2.stop();
            }
            else {
                b1.y += (b2.top - b1.bottom);
                b1.stop();
            }
        });

        // collision box to everything else
        this.scene.physics.add.collider(crateGroup, [
            level.laag_platform,
            level.laag_objecten,
            player
        ]);    
    }

    /**
     *
     */
    createSpike(){
        // Create new crate and add to group
        let spike = new Spike(this.scene, this.x-10, this.y)
        spikeGroup.add(spike)


        // collision Spike to where it have to lay
        this.scene.physics.add.collider(spikeGroup, [
            level.laag_platform,
            level.laag_objecten,
        ]);  
        
        this.scene.physics.add.overlap(spike, player, this.hitBySpike, null, this);
    }

    hitBySpike(spike, player){
        // cooldown
        if (this.spikeHitCooldown > 0) {
            return;
        }
        this.spikeHitCooldown = 100;

        this.dealDmg(spike)
    }
}
