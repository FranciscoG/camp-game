import globals from "./global.js";

export default function create() {
  globals.keys = this.input.keyboard.createCursorKeys();
  // load the map
  globals.map = this.make.tilemap({ key: "map" });

  // tiles for the ground layer
  var tileset = globals.map.addTilesetImage("tileset");

  // create the world laters
  globals.bgLayer = globals.map.createStaticLayer("background", tileset);
  globals.groundLayer = globals.map.createDynamicLayer("platforms", tileset);
  globals.fgLayer = globals.map.createStaticLayer('foreground', tileset)
  
  // the player will collide with this layer
  globals.groundLayer.setCollisionByExclusion([-1]);

  // set the boundaries of our game world
  this.physics.world.bounds.width = globals.bgLayer.width;
  this.physics.world.bounds.height = globals.bgLayer.height;

  // create the player sprite
  globals.player = this.physics.add.sprite(16, 16, "player");
  globals.player.setBounce(0); // our player will bounce from items
  globals.player.setCollideWorldBounds(true); // don't go out of the map

  // small fix to our player images, we resize the physics body object slightly
  globals.player.body.setSize(globals.player.width - 8, globals.player.height);

  // player will collide with the level tiles
  this.physics.add.collider(globals.groundLayer, globals.player);

  // player walk animation
  this.anims.create({
    key: "running",
    frames: this.anims.generateFrameNames("player", {
      prefix: "running",
      start: 1,
      end: 3,
      zeroPad: 2
    }),
    frameRate: 10,
    repeat: -1
  });
  
  // idle with only one frame, so repeat is not neaded
  this.anims.create({
    key: "standing",
    frames: [{ key: "player", frame: "standing" }],
    frameRate: 10
  });

  //
  this.anims.create({
    key: "jump_hold",
    frames: [{ key: "player", frame: "jump01" }],
    frameRate: 10
  })

  // jumping animation
  this.anims.create({
    key: "jumping",
    frames: this.anims.generateFrameNames("player", {
      prefix: "jump",
      start: 1,
      end: 3,
      zeroPad: 2
    }),
    frameRate: 10,
    repeat: -1
  });

  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(
    0,
    0,
    globals.map.widthInPixels,
    globals.map.heightInPixels
  );
  // make the camera follow the player
  this.cameras.main.startFollow(globals.player);

  console.log(globals.fgLayer, globals.map, globals.player)
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
