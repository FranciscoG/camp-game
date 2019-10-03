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

  setupWaterAndBones() {

    this.bgLayer.setTileIndexCallback(50, this.startOver, this);  
    
    const water = this.map.getObjectLayer('PitObjects')['objects'].filter(x => x.name === "water");
    console.log(water)
    
    water.forEach(tile => {
      this.bgLayer.setTileLocationCallback(tile.x, tile.y, tile.width, tile.height, this.startOver, this)
      this.physics.add.overlap(this.player, tile);
    })
    

    // // this.waterLayer.forEach( tile => {
    // //   const water = this.pits.create(tile.x, tile.y, "water").setOrigin(0, 0);
    // //   water.body.setSize(tile.width, tile.height)
    // // })
    // this.boneLayer.forEach( tile => {
    //   this.pits.create(tile.x, tile.y, "bones").setOrigin(0, 0);
    // })
  }

  create() {
    this.timeout = null

    // load the map
    this.map = this.make.tilemap({ key: "map" });

    // tiles for the ground layer
    var tileset = this.map.addTilesetImage("tileset");

    // create the world layers
    this.bgLayer = this.map.createDynamicLayer("background", tileset);
    this.groundLayer = this.map.createDynamicLayer("platforms", tileset);
    this.fgLayer = this.map.createDynamicLayer("foreground", tileset);
    this.fgLayer.setDepth(1);

    this.sys.animatedTiles.init(this.map);

    this.keys = this.input.keyboard.createCursorKeys();

    // the player will collide with this layer
    this.groundLayer.setCollisionByExclusion([-1]);

    // set the boundaries of our game world
    this.physics.world.bounds.width = this.bgLayer.width;
    this.physics.world.bounds.height = this.bgLayer.height;

    // get player spawn point
    const playerSpawn = this.map.getObjectLayer('SpawnPoints')['objects'][0];
    console.log("playerSpawn",playerSpawn)

    // create the player sprite
    this.player = new PlayerSprite(this, playerSpawn.x, playerSpawn.y, this.playerNum);
    this.player.usePhysics();
    this.player.setupAnimations();

    // player will collide with the level tiles
    this.physics.add.collider(this.groundLayer, this.player);

    this.setupWaterAndBones()

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
    this.player.update(this.keys);
    // if (this.physics.world.overlap(this.player, this.pits) && !this.timeout) {
    //   this.player.death()
    //   this.startOver()
    // }
  }

  startOver() {
    this.player.death()
    this.timeout = setTimeout(() => {
      this.scene.start("PLAY", { playerNum: this.playerNum });
    }, 1500);
  }
}