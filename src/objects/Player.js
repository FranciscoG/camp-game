import Phaser from "phaser";

const worldHeight = 120;
const gravity = worldHeight * 4;
const RightRunVelocity = 45;
const LeftRunVelocity = RightRunVelocity * -1;
const JumpVelocity = (gravity / 3.5) * -1;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, playerNum) {
    console.log("constructing new player")
    super(scene, x, y, "player");
    scene.add.existing(this);
    this.scene = scene;
    this.dying = false
    this.playerNum = playerNum
  }

  usePhysics() {
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true); // don't go out of the map
    this.setBounce(0);
    // small fix to our player images, we resize the physics
    // body object slightly
    this.body.setSize(this.width - 8, this.height);
  }

  setupAnimations() {
    const num = this.playerNum

    // player walk animation
    this.scene.anims.create({
      key: `running_${num}`,
      frames: this.scene.anims.generateFrameNames("player", {
        prefix: `p${num}_run`,
        start: 1,
        end: 4,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });

    // idle with only one frame, so repeat is not neaded
    this.scene.anims.create({
      key: `standing_${num}`,
      frames: [{ key: "player", frame: `p${num}_stand` }],
      frameRate: 1
    });

    // jump in the air pose
    this.scene.anims.create({
      key: `jumping_${num}`,
      frames: [{ key: "player", frame: `p${num}_jump` }],
      frameRate: 1
    });

    // crouch
    this.scene.anims.create({
      key: `crouch_${num}`,
      frames: [{ key: "player", frame: `p${num}_crouch` }],
      frameRate: 10
    });

    // hurt
    this.scene.anims.create({
      key: `hurting_${num}`,
      frames: this.scene.anims.generateFrameNames("player", {
        prefix: `p${num}_hurt`,
        start: 1,
        end: 2,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });
  }

  beginJump() {
    this.body.setVelocityY(JumpVelocity);
  }

  jumping() {
    this.anims.play(`jumping_${this.playerNum}`, true);
    this.body.setVelocityX(0);
  }

  stand() {
    this.anims.play(`standing_${this.playerNum}`, true);
  }

  stopMoving() {
    this.body.setVelocityX(0);
  }

  running() {
    this.anims.play(`running_${this.playerNum}`, true);
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
    this.anims.play(`crouch_${this.playerNum}`, true);
    this.body.setVelocityX(0);
  }

  hurting() {
    this.body.setVelocityX(0);
    this.anims.play(`hurting_${this.playerNum}`, true);
  }

  update(keys, onDeath) {
    if (this.dying) {
      return;
    }

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

    if (keys.up.isDown && onFloor) {
      this.beginJump()
    }
    // if player y is greater 88, kill player
    // if (this.y > 88) {
    //   this.hurting()
    //   onDeath()
    //   this.dying = true
    // }
  }
}
