import _ from 'lodash';
import ArcadeSprite from './ArcadeSprite';
import PlayerInput from './PlayerInput';
import PlayerState from './PlayerState';
import Fireball from './items/Fireball';
import Crate from './items/Crate';
import Spike from './items/Spike';
import Trampoline from './items/Trampoline';

import Hud from '../scenes/attributes/Hud';


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
    kills = 0;

    /**
     *
     */
    cooldowns = {
        hit: Player.hitCooldown,
        primary: 0,
        secondary: 0,
    };

    /**
     *
     */
    PrimaryItem = Fireball;

    /**
     *
     */
    secondaryItems = [
        {
            Item: Trampoline,
            amount: 1
        },
        {
            Item: Crate,
            amount: 5
        },
        {
            Item: Spike,
            amount: 2
        },
    ];

    /**
     *
     */
    input = new PlayerInput(this);

    /**
     *
     */
    state = new PlayerState(this);

    /**
     *
     */
    constructor(scene, data) {
        super(scene, data);

        this.character = data.character;
        this.health = data.health;

        this.scene.physics.add.collider(this, this.scene.getSolids());

        this.setSize(50, 94, true);
        this.setDragY(300);

        this.scene.scene.add('Hud', new Hud(this), true);
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
        if (this.input.jump) {

            // Single jump
            if (this.state.canJump) {
                this.jump();
            }
            // dubble jump
            else if (this.state.canDubbleJump) {
                this.dubbleJump();
            }
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
        this.state.isDubbleJump = true;
        this.setVelocityY(this.jumpVelocity * -1);
    }

    dubbleJump() {
        this.state.isDubbleJump = false
        this.setVelocityY(this.jumpVelocity * -0.8);
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
    addSecondaryItem(Item) {
        const lastSlot = _.last(this.secondaryItems);

        if (lastSlot.Item === Item) {
            lastSlot.amount += Item.amount;
        } else {
            this.secondaryItems.push({
                Item: Item,
                amount: Item.amount,
            });
        }
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

        let slot;

        if (this.secondaryItems[0].amount > 1) {
            this.secondaryItems[0].amount--;
            slot = this.secondaryItems[0];
        } else {
            slot = this.secondaryItems.shift();
        }

        slot.Item.use(this);

        this.cooldowns.secondary = slot.Item.cooldown;
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
