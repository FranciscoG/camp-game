import Phaser from "phaser";

const worldHeight = 120;
const gravity = worldHeight * 4;
const RightRunVelocity = 45;
const LeftRunVelocity = RightRunVelocity * -1;
const JumpVelocity = (gravity / 3.5) * -1;

export class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "PLAY" });

    this.map = null;
    this.player = null;
    this.keys = null;

    // map layers
    this.bgLayer = null;
    this.groundLayer = null;
    this.fgLayer = null;

    this.player_num = "p1_";
  }

  preload() {
    const p_ = this.player_num;

    // player walk animation
    this.anims.create({
      key: "running",
      frames: this.anims.generateFrameNames("player", {
        prefix: p_ + "run",
        start: 1,
        end: 4,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });

    // idle with only one frame, so repeat is not neaded
    this.anims.create({
      key: "standing",
      frames: [{ key: "player", frame: p_ + "stand" }],
      frameRate: 10
    });

    // jump in the air pose
    this.anims.create({
      key: "jumping",
      frames: [{ key: "player", frame: p_ + "jump" }],
      frameRate: 10
    });

    // crouch
    this.anims.create({
      key: "crouch",
      frames: [{ key: "player", frame: p_ + "crouch" }],
      frameRate: 10
    });

    // hurt
    this.anims.create({
      key: "hurting",
      frames: [{ key: "player", frame: p_ + "hurt" }],
      frameRate: 10
    });

    // load the map
    this.map = this.make.tilemap({ key: "map" });

    // tiles for the ground layer
    var tileset = this.map.addTilesetImage("tileset");

    // create the world layers
    this.bgLayer = this.map.createStaticLayer("background", tileset);
    this.groundLayer = this.map.createDynamicLayer("platforms", tileset);
    this.fgLayer = this.map.createStaticLayer("foreground", tileset);
  }

  create() {
  
    this.keys = this.input.keyboard.createCursorKeys();
    
    // the player will collide with this layer
    this.groundLayer.setCollisionByExclusion([-1]);

    // set the boundaries of our game world
    this.physics.world.bounds.width = this.bgLayer.width;
    this.physics.world.bounds.height = this.bgLayer.height;

    // create the player sprite
    this.player = this.physics.add.sprite(16, 16, "player");
    this.player.setBounce(0); // our player will bounce from items
    this.player.setCollideWorldBounds(true); // don't go out of the map

    // small fix to our player images, we resize the physics body object slightly
    this.player.body.setSize(this.player.width - 8, this.player.height);

    // player will collide with the level tiles
    this.physics.add.collider(this.groundLayer, this.player);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);

    console.log(this.fgLayer, this.map, this.player, this.bgLayer);
  }

  update(time, delta) {
    var onFloor = this.player.body.onFloor();

    if (!onFloor) {
      this.player.anims.play("jumping", true);
      this.player.body.setVelocityX(0);
    }

    if (this.keys.left.isDown) {
      this.player.body.setVelocityX(LeftRunVelocity);
      if (onFloor) {
        this.player.anims.play("running", true); // walk left
      }
      this.player.flipX = true; // flip the sprite to the left
    } else if (this.keys.right.isDown) {
      this.player.body.setVelocityX(RightRunVelocity);
      if (onFloor) {
        this.player.anims.play("running", true); // walk left
      }
      this.player.flipX = false; // use the original sprite looking to the right
    } else if (this.keys.down.isDown && onFloor) {
      this.player.anims.play("crouch", true);
      this.player.body.setVelocityX(0);
    } else if (onFloor) {
      this.player.body.setVelocityX(0);
      this.player.anims.play("standing", true);
    }

    if (this.keys.up.isDown && onFloor) {
      this.player.body.setVelocityY(JumpVelocity);
    }
    // if player y is greater 88, kill player
    if (this.player.y > 88) {
      // this.player
    }
  }
}

/*
Character animations:

- crouch: crouch for one frame before jumping, and then crouch again for one frame when he lands.

- jump/fall: just one frame for this; the same pose while going up and going down. 


- jump height: set to 16-pixel block; the top of his jump has his feet at 18 px off the ground.

- jump distance: clear 28 pixels of distance. The water he jumps over here is 24 pixels wide. 

- hit: ?

- dying: ?

World:

- all the platforms in the game will be based on blocks of 8x8 pixels, 
- 128x120 px (half NES size) 
- 16 screens to make a total width of 2048px

*/
