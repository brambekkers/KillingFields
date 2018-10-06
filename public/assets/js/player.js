class Player {
    constructor(scene, player) {
        this.scene = scene
        this.id = player.id

        this.sprite = this.scene.physics.add.sprite(player.x, player.y, 'player').setBounce(0.1);
        this.sprite.body.allowGravity = false;
    }

    update() {
        this.move();
    }

    move() {
        if (!this.cursors) {
            return;
        }

        let animation = 'turn';
        let looping = false;

        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-300);

            animation = 'left';
            looping = true;
            this.sprite.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(300);
            animation = 'right';
            looping = true;
            this.sprite.flipX = false;
        } else {
            this.sprite.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.sprite.body.blocked.down) {
            this.sprite.setVelocityY(-1000);
        } else if (this.cursors.down.isDown) {
            this.sprite.setVelocityY(600);
        }

        if (!this.sprite.body.blocked.down) {
            animation = 'jump';
            looping = true;
        }

        this.sprite.anims.play(animation, looping);

        socket.emit('move', {
            x: this.sprite.x,
            y: this.sprite.y,
            animation: animation,
            looping: looping,
            flipX: this.sprite.flipX,
        });
    }

    setPosition(data) {
        this.sprite.x = data.x;
        this.sprite.y = data.y;
        this.sprite.anims.play(data.animation, data.looping);
        this.sprite.flipX = data.flipX;
    }

}
