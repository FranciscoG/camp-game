import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles/dist/AnimatedTiles.js";
import PlayerSprite from "../objects/Player";

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

    this.playerNum = 1;
  }

  init(data) {
    console.log("play init data=", data);
    this.playerNum = data.playerNum;
  }

  preload() {
    this.load.scenePlugin(
      "animatedTiles",
      AnimatedTiles,
      "animatedTiles",
      "animatedTiles"
    );
  }

  create() {
    // load the map
    this.map = this.make.tilemap({ key: "map" });

    // tiles for the ground layer
    var tileset = this.map.addTilesetImage("tileset");

    // create the world layers
    this.bgLayer = this.map.createDynamicLayer("background", tileset);
    this.groundLayer = this.map.createDynamicLayer("platforms", tileset);
    this.fgLayer = this.map.createDynamicLayer("foreground", tileset);
    this.fgLayer.setDepth(1);

    this.deadly = this.physics.add.staticGroup();

    this.waterLayer = this.map.createFromObjects("killer_env", 49, { key: "water"})
    console.log(this.waterLayer)
    this.waterLayer.forEach( tile => {
      const water = this.deadly.create(tile.x, tile.y, "water");
      water.body.setSize(8, 8)
      this.bgLayer.removeTileAt(tile.x, tile.y);
    })

    this.sys.animatedTiles.init(this.map);

    this.keys = this.input.keyboard.createCursorKeys();

    // the player will collide with this layer
    this.groundLayer.setCollisionByExclusion([-1]);

    // set the boundaries of our game world
    this.physics.world.bounds.width = this.bgLayer.width;
    this.physics.world.bounds.height = this.bgLayer.height;

    // create the player sprite
    this.player = new PlayerSprite(this, 16, 16, this.playerNum);
    this.player.usePhysics();
    this.player.setupAnimations();

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
    this.player.update(this.keys, this.startOver.bind(this));
    if (this.physics.world.overlap(this.player, this.deadly)) {
      console.log("player be dead")
    }
  }

  startOver() {
    setTimeout(() => {
      this.scene.start("PLAY", { playerNum: this.playerNum });
    }, 1500);
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
