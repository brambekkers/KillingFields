class Player{
    constructor(scene, player) {
        this.scene = scene
        this.id = player.id

        this.sprite = this.scene.physics.add.sprite(player.x, player.y, 'player');
    }

    create(){
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'player', frame: 12 } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
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

        if (this.cursors.up.isDown && player.body.touching.down)
        {
            this.sprite.setVelocityY(-330);
        }

        socket.emit('move', {
            x: this.sprite.x,
            y: this.sprite.y,
        });
    }

    setPosition(x, y) {
        console.log('setPosition');
        this.sprite.x = x;
        this.sprite.y = y;
    }

}
