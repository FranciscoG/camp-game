import Phaser from "phaser";

const worldHeight = 120;
const gravity = worldHeight * 4;
const RightRunVelocity = 45;
const LeftRunVelocity = RightRunVelocity * -1;
const JumpVelocity = (gravity / 3.5) * -1;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    console.log("constructing new player")
    super(scene, x, y, "player");
    scene.add.existing(this);
    this.scene = scene;
    this.dying = false
  }

  usePhysics() {
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true); // don't go out of the map
    this.setBounce(0);
    // small fix to our player images, we resize the physics
    // body object slightly
    this.body.setSize(this.width - 8, this.height);
  }

  resetBodySize() {
    this.body.setSize(this.width - 8, this.height);
    this.setOffset(4, 0)
  }

  beginJump() {
    this.body.setVelocityY(JumpVelocity);
    this.scene.soundFx.play("jump");
  }

  jumping() {
    this.anims.play("player_jump", true);
    this.body.setVelocityX(0);
  }

  stand() {
    this.anims.play("player_stand", true);
  }

  stopMoving() {
    this.body.setVelocityX(0);
  }

  running() {
    this.anims.play("player_run", true);
  }

  moveLeft(onFloor) {
    this.body.setVelocityX(LeftRunVelocity);
    if (onFloor) {
      this.running()
    }
    this.flipX = true; // flip the sprite to the left
  }

  moveRight(onFloor) {
    this.body.setVelocityX(RightRunVelocity);
    if (onFloor) {
      this.running()
    }
    this.flipX = false; // use the original sprite looking to the right
  }

  crouch() {
    this.anims.play("player_crouch", true);
    this.body.setVelocityX(0);
    this.body.setSize(this.width - 8, this.height - 6);
    this.setOffset(4, 6)
  }

  death() {
    this.scene.music.play("player-death")
    this.dying = true
    this.body.setVelocityX(0);
    this.anims.play("player_hurt", true);
  }

  update(keys) {
    if (this.dying) {
      return;
    }
    this.resetBodySize()

    var onFloor = this.body.onFloor();

    if (!onFloor) {
      this.jumping()
    }

    if (keys.left.isDown) {
      this.moveLeft(onFloor)
    } else if (keys.right.isDown) {
      this.moveRight(onFloor)
    } else if (keys.down.isDown && onFloor) {
      this.crouch()
    } else if (onFloor) {
      this.stand()
      this.stopMoving()
    }

    if ((keys.up.isDown || keys.space.isDown) && onFloor) {
      this.beginJump()
    }
  }
}
