import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles/dist/AnimatedTiles.js";
import PlayerSprite from "../objects/Player";

export class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "PLAY" });
  }

  init(data) {
    console.log("play init data=", data);
    this.playerNum = data.playerNum || 1;
  }

  preload() {
    this.load.scenePlugin(
      "animatedTiles",
      AnimatedTiles,
      "animatedTiles",
      "animatedTiles"
    );
  }

  setupWaterAndBones(player) {
    this.deathPits = this.physics.add.staticGroup();
    const pitObjects = this.map.getObjectLayer("PitObjects");

    this.anims.create({
      key: "flow",
      frames: this.anims.generateFrameNumbers("water_sprites", {
        start: 0,
        end: 1
      }),
      frameRate: 1,
      repeat: -1
    });

    pitObjects.objects.forEach(tile => {
      let texture = "water_sprites";
      if (tile.name === "bones") {
        texture = "blank8x8";
      }
      let obj = this.deathPits.create(tile.x, tile.y, texture);
      obj.setOrigin(0);
      obj.body.width = tile.width;
      obj.body.height = tile.height;
      if (tile.name === "water") {
        this.anims.play("flow", obj);
      }
    });

    this.physics.add.overlap(
      player,
      this.deathPits,
      this.startOver,
      null,
      this
    );
  }

  setupPlayer() {
    // get player spawn point
    const playerSpawn = this.map
      .getObjectLayer("SpawnPoints")
      .objects.filter(o => o.name === "player_spawn")[0];

    // create the player sprite
    this.player = new PlayerSprite(
      this,
      playerSpawn.x,
      playerSpawn.y,
      this.playerNum
    );
    this.player.usePhysics();
    this.player.setupAnimations();

    // player will collide with the level tiles
    this.physics.add.collider(this.groundLayer, this.player);
  }

  setupMap() {
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
  }

  create() {
    this.setupMap();

    this.setupPlayer();

    this.setupWaterAndBones(this.player);

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
  }

  startOver() {
    if (this.deathTimeout) return;

    this.player.death();
    this.deathTimeout = setTimeout(() => {
      this.scene.restart();
      this.deathTimeout = null;
    }, 1500);
  }
}
