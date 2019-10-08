import Phaser from "phaser";

/**
 * Sprite class to handle items that fly from right to left and can kill the player
 * 
 * Haunted items from the book -- 
 *  they would each appear once in the game, probably closer to the end. 
 *  They would simply fly in from the right and go in a straight line off to 
 *  the left, like the skulls; you just jump over them:

    1. underwear sprite -- 4 frames, 8x8 px   uw-01 -> uw-04
    2. branch sprite -- static, 16x16 prefix   branch
    3. book sprite -- 4 frames, 16x16 px    book-01 -> book-04
    4. towel sprite -- 9 frames, 16x16 px   towel-01 -> towel-09

    config {
      x,
      y,
      key, the key to give the sprite to access throughout the Scene
      prefix,   the prefix from the json 
      size,  the WxH size, should be exactly the same so provide only one num
      startFrame,
      endFrame,
      player, the player object
    }
 */

export default class FlyingItem extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config) {
    super(scene, config.x, config.y, config.key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.allowGravity = false;

    this.setOrigin(0, 0);
    this.body.setSize(config.size - 2, config.size - 2);
    this.setOffset(0, 0);

    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.setupAnimations(config);

    this.body.setImmovable(true);

    this.body.world.once(
      "worldbounds",
      function(body) {
        // Check if the body's game object is the sprite you are listening for
        if (body.gameObject === this) {
          // Stop physics and render updates for this object
          this.setActive(false);
          this.setVisible(false);
        }
      },
      this
    );

    this.scene.physics.add.collider(
      this,
      this.scene.player,
      this.scene.startOver,
      null,
      this.scene
    );

    if (config.autoStart) {
      this.beginFlying();
    }
  }

  setupAnimations(config) {
    if (config.prefix === "branch") {
      this.animKey = "branch_fly";
      this.scene.anims.create({
        key: this.animKey,
        frames: [{ key: "items16x16", frame: "branch" }]
      });
      return;
    }

    let { size, key, prefix, startFrame, endFrame } = config;
    this.animKey = `${key}_flying`;

    this.scene.anims.create({
      key: this.animKey,
      frames: this.scene.anims.generateFrameNames(`items${size}x${size}`, {
        prefix: prefix,
        start: startFrame,
        end: endFrame,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });
  }

  beginFlying() {
    this.flying = true;
    this.anims.play(this.animKey, true);
    this.body.setVelocityX(-50);
  }

  stopFlying() {
    this.body.setVelocityX(0);
  }

  update(time, delta) {
    if (this.flying) {
      return;
    }
    if (this.scene.cameras.main.worldView.contains(this.x, this.y)) {
      this.beginFlying();
    }
  }
}
