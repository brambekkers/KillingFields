class Player{
    constructor(scene, player){
        this.scene = scene
        this.id = player.id
        this.x = player.x || 800/2
        this.y = player.y || 600/2

        this.r = 20
        this.sprite = null

        this.create()
    }

    create(){
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'player');
    }

    update(){
        if (cursors.left.isDown)
        {
            this.sprite.setVelocityX(-160);

            this.sprite.anims.play('left', true);
            this.sprite.flipX = true
        }
        else if (cursors.right.isDown)
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

        if (cursors.up.isDown && this.sprite.body.touching.down)
        {
            this.sprite.setVelocityY(-600);
        }

    }

}
