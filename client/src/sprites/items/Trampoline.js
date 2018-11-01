import ArcadeItem from './ArcadeItem';
import Vector2 from '../../math/Vector2';

/**
 *
 */
export default class Trampoline extends ArcadeItem {
	/**
	 * The name of the image asset that should be displayed in the HUD.
	 */
	static icon = 'trampolineUp';

	/**
	 * The amount of spikes you get from a pickup
	 */
	static amount = 2;

	/**
	 * The amount of spikes you get from a pickup
	 */
	jumpVelocity = 1300;

	/**
	 *
	 */
	constructor(scene, data) {
		super(scene, Object.assign(data, {
			texture: 'trampolineUp',
		}));

		this.damage = 2;

		this.scene.physics.add.collider(this, this.scene.getSolids());
		this.scene.physics.add.overlap(this, this.scene.player, this.onOverlapPlayer);

		this.scene.groups.spikes.add(this);

		this.setSize(70, 35)
		this.body.setOffset(0, 35);

		scene.anims.create({
			key: 'trampolineAnims',
			frames: [
				{ key: 'trampolineDown' },
				{ key: 'trampolineUp', duration: 50 }
			],
			repeat: 1
		});
	}

	/**
	 *
	 */
	static preload(scene) {
		scene.load.image('trampolineDown', 'assets/img/Items/springboardDown.png');
		scene.load.image('trampolineUp', 'assets/img/Items/springboardUp.png');
	}

	/**
	 *
	 */
	static use(player) {
		const position = new Vector2(player.x, player.y);
		const direction = new Vector2(player.flipX ? -1 : 1, 0).normalize();

		const trampoline = new Trampoline(player.scene, {
			position: position.add(direction.multiply(70)),
		});

		window.socket.emit('shoot', trampoline.toData());
	}

	/**
	 *
	 */
	onOverlapPlayer = (trampoline, player) => {
		player.setVelocityY(this.jumpVelocity * -1);
		this.play('trampolineAnims');
	};

	/**
	 * Returns the data representation of this instance, so that it can be sent
	 * to the server.
	 */
	toData() {
		return Object.assign(super.toData(), {
			type: 'trampoline',
		});
	}
}
