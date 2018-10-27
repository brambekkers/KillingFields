import ArcadeSprite from './ArcadeSprite';
import PlayerInput from './PlayerInput';
import PlayerState from './PlayerState';
import Fireball from './items/Fireball';
import Crate from './items/Crate';
import Spike from './items/Spike';
import Trampoline from './items/Trampoline';

/**
 *
 */
export default class Player extends ArcadeSprite {
    /**
     * The duration of the invincible state after a player is hit.
     */
    static hitCooldown = 60;

    /**
     * The velocity applied in the negative vertical direction when a player
     * jumps.
     */
    jumpVelocity = 1000;

    /**
     * The horizontal velocity applied to the player when walking.
     */
    walkVelocity = 400;

    /**
     * The limit of the player's positive vertical velocity.
     *
     * NB: If the velocity is allowed to become too large, the player may clip
     * through some colliders.
     */
    fallVelocity = 600;

    /**
     *
     */
    constructor(scene, data) {
        super(scene, data);

        this.scene = scene
        this.character = data.character;
        this.health = data.health;
        this.kills = 0;

        this.setSize(50, 94, true);
        this.setDragY(300);

        this.cooldowns = {
            hit: Player.hitCooldown,
            primary: 0,
            secondary: 0,
        };

        this.PrimaryItem = Fireball;
        this.secondaryItems = [
            {
                object: Trampoline,
                amount: 1
            },
            {
                object: Crate,
                amount: 5
            },
            {
                object: Spike,
                amount: 2
            },
        ];

        this.input = new PlayerInput(this);
        this.state = new PlayerState(this);

        this.hud = this.scene.scene.get('Hud');
        this.hud.setPlayer(this);

        this.scene.physics.add.collider(this, this.scene.getSolids());

    }

    /**
     *
     */
    static preload(scene) {
        for (let i = 1; i <= 5; i++) {
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
        for (let i = 1; i <= 5; i++) {
            scene.anims.create({
                key: `player${i}_walk`,
                frames: scene.anims.generateFrameNumbers(`player${i}`, {
                    start: 0,
                    end: 4,
                }),
                frameRate: 15,
                repeat: -1,
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
        this.face();
        this.move();
        this.limitMovement();
        this.animateMovement();

        this.coolDown();
        this.displayHitCooldown();
        this.useItems();

        this.hud.update();
    }

    ////////////////////
    ///// MOVEMENT /////
    ////////////////////

    /**
     *
     */
    face() {
        if (this.input.left) {
            this.flipX = true;
        }

        if (this.input.right) {
            this.flipX = false;
        }
    }

    /**
     *
     */
    move() {
        // Walking.
        this.walk(this.input.horizontal);

        // Jumping.
        if (this.input.jump && this.state.canJump) {
            this.jump();
        }

        // Ducking.
        else if (this.input.down && this.state.canDuck) {
            this.duck();
        }

        // Standing up.
        if (!this.input.down && this.state.canStand) {
            this.stand();
        }

        window.socket.emit('move', this.toData());
    }

    /**
     *
     */
    walk(direction) {
        this.setVelocityX(this.walkVelocity * direction);
    }

    /**
     *
     */
    jump() {
        this.setVelocityY(this.jumpVelocity * -1);
    }

    /**
     *
     */
    duck() {
        this.state.isDucking = true;

        this.setSize(50, 65);
        this.body.setOffset(12.5, 30);
    }

    /**
     *
     */
    stand() {
        this.state.isDucking = false;
        this.setSize(50, 94)
    }

    /**
     *
     */
    limitMovement() {
        const limitExceeded = this.body.velocity.y > this.fallVelocity;

        if (this.state.isAirborne && limitExceeded) {
            this.setVelocityY(this.fallVelocity);
        }
    }

    /////////////////////
    ///// ANIMATION /////
    /////////////////////

    /**
     *
     */
    animateMovement() {
        if (this.state.isAirborne) {
            this.anims.play(`${this.character}_jump`);
        } else if (this.state.isDucking) {
            this.anims.play(`${this.character}_duck`);
        } else if (this.state.isWalking) {
            this.anims.play(`${this.character}_walk`, true);
        } else {
            this.anims.play(`${this.character}_turn`,);
        }
    }

    /////////////////
    ///// ITEMS /////
    /////////////////

    /**
     *
     */
    coolDown() {
        this.cooldowns.hit--;
        this.cooldowns.primary--;
        this.cooldowns.secondary--;
    }

    /**
     *
     */
    addItem(Item) {
        this.secondaryItems.push(Item);
    }

    /**
     *
     */
    useItems() {
        if (this.input.primary) {
            this.usePrimaryItem();
        }

        if (this.input.secondary) {
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
            this.secondaryItems.length <= 0 ||
            this.cooldowns.secondary > 0
        ) {
            return;
        }

        let Item;

        if (this.secondaryItems[0].amount > 1) {
            this.secondaryItems[0].amount--;
            Item = this.secondaryItems[0];
        } else {
            Item = this.secondaryItems.shift();
        }
        
        Item.object.use(this);

        this.cooldowns.secondary = Item.object.cooldown;
    }

    //////////////////
    ///// HEALTH /////
    //////////////////

    /**
     *
     */
    displayHitCooldown() {
        if (this.cooldowns.hit > 0) {
            this.setAlpha(0.5);
        } else {
            this.setAlpha(1);
        }
    }

    /**
     * @todo Souldn't the server determine whether the player died instead?
     */
    hitBy(item) {
        if (this.cooldowns.hit > 0) {
            return;
        }

        this.cooldowns.hit = Player.hitCooldown;

        this.health -= item.damage;

        if (this.health > 0) {
            window.socket.emit('hit', item.damage);
        } else {
            this.die();
        }
    }

    /**
     *
     */
    die() {
        this.hud.update();

        this.disableBody(true, true);
        this.scene.player = undefined;

        window.socket.emit('died');
    }
}
