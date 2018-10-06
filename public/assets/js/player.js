class Player{
    constructor(scene, player) {
        this.scene = scene
        this.id = player.id

        this.sprite = this.scene.physics.add.sprite(player.x, player.y, 'player');
    }

    update() {
        this.move();
    }

    move() {
        if (!this.cursors) {
            return;
        }

        if (this.cursors.left.isDown)
        {
            this.sprite.setVelocityX(-160);

            this.sprite.anims.play('left', true);
            this.sprite.flipX = true
        }
        else if (this.cursors.right.isDown)
        {
            this.sprite.setVelocityX(160);
            this.sprite.anims.play('right', true);
            this.sprite.flipX = false

        }
        else
        {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.sprite.body.touching.down)
        {
            this.sprite.setVelocityY(-600);
        }

        socket.emit('move', {
            x: this.sprite.x,
            y: this.sprite.y,
        });
    }

    setPosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }

}
