import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles/dist/AnimatedTiles.js";
import PlayerSprite from "../objects/Player";
import Boss from "../objects/Boss"

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

  setupWaterHand() {
    // player walk animation
    this.anims.create({
      key: "water_hand_rise",
      frames: this.anims.generateFrameNames("items16x16", {
        prefix: `hand-`,
        start: 0,
        end: 17,
        zeroPad: 2
      }),
      frameRate: 5,
      repeat: -1,
      repeatDelay: 3000
    });

    // if index === 3,  height = 16
    // then -- from there until index 18


    this.spawnPoints.objects
      .filter(f => f.name === "water_hand")
      .forEach(tile => {
        let obj = this.nonMovingKillers.create(tile.x + 8, tile.y + 8, "items16x16");
        const hitWidth = tile.width - 10;
        obj.body.setSize(hitWidth, 0);
        this.anims.play("water_hand_rise", obj);
        obj.on('animationupdate-water_hand_rise', function (anim, frame) {
          // console.log('water rise', frame)
          if (frame.index >= 3) {
            obj.body.setSize(hitWidth, 16 - (frame.index - 3) );
          } else {
            obj.body.setSize(hitWidth, 0);
          }
        });
      });
  }

  setupCampfire() {
    // player walk animation
    this.anims.create({
      key: "campfire_burn",
      frames: this.anims.generateFrameNames("items8x8", {
        prefix: `fire-`,
        start: 1,
        end: 4,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });

    this.spawnPoints.objects
      .filter(f => f.name === "camp_fire")
      .forEach(tile => {
        let obj = this.nonMovingKillers.create(tile.x, tile.y + 4, "items8x8");
        obj.body.setSize(tile.width - 2, tile.height);
        this.anims.play("campfire_burn", obj);
      });
  }

  setupWaterAndBones() {
    this.nonMovingKillers = this.physics.add.staticGroup();
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
      let obj = this.nonMovingKillers.create(tile.x + 4, tile.y + 4, texture);
      obj.body.width = tile.width;
      obj.body.height = tile.height;
      if (tile.name === "water") {
        this.anims.play("flow", obj);
      }
    });
  }

  setupPlayer() {
    // get player spawn point
    const playerSpawn = this.spawnPoints.objects.filter(
      o => o.name === "player_spawn"
    )[0];

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

  setupBoss() {
    // get player spawn point
    const bossSpawn = this.spawnPoints.objects.filter(
      o => o.name === "boss"
    )[0];
    console.log(bossSpawn)

    // create the player sprite
    this.boss = new Boss(
      this,
      bossSpawn
    );

    // player will collide with the level tiles
    this.physics.add.collider(this.groundLayer, this.boss);
  }

  create() {
    this.setupMap();

    this.spawnPoints = this.map.getObjectLayer("SpawnPoints");

    this.setupPlayer();

    this.setupWaterAndBones();

    this.setupCampfire();
    this.setupWaterHand()
    this.setupBoss()

    this.physics.add.overlap(
      this.player,
      this.nonMovingKillers,
      this.startOver,
      null,
      this
    );

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
    this.boss.update(time, delta)
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
