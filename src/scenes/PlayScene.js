import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles/dist/AnimatedTiles.js";
import PlayerSprite from "../objects/Player";
import Boss from "../objects/Boss";
import FlyingItem from "../objects/FlyingItem";

var spawnPointNum = 1

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
      frameRate: 10,
      repeat: -1,
      repeatDelay: 2000
    });

    // if index === 3,  height = 16
    // then -- from there until index 18

    this.spawnPoints.objects
      .filter(f => f.name === "water_hand")
      .forEach(tile => {
        let obj = this.nonMovingKillers.create(
          tile.x + 8,
          tile.y + 8,
          "items16x16"
        );
        const hitWidth = tile.width - 10;
        obj.body.setSize(hitWidth, 0);
        this.anims.play("water_hand_rise", obj);
        obj.on("animationupdate-water_hand_rise", function(anim, frame) {
          // console.log('water rise', frame)
          if (frame.index >= 3) {
            obj.body.setSize(hitWidth, 16 - (frame.index - 3));
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
    this.playerSpawnPoints = this.spawnPoints.objects.filter(
      o => o.name === "player_spawn"
    );

    const point = this.playerSpawnPoints.filter(x => parseInt(x.type,10) === spawnPointNum)[0]

    // create the player sprite
    this.player = new PlayerSprite(
      this,
      point.x,
      point.y,
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
    console.log(bossSpawn);

    // create the player sprite
    this.boss = new Boss(this, bossSpawn);

    // player will collide with the level tiles
    this.physics.add.collider(this.groundLayer, this.boss);
  }

  setupFlyingObjects() {
    this.flyers = this.map
      .getObjectLayer("SpawnPoints")
      .objects.filter(x => x.type === "flying_object");

    this.flyingSprites = [];
    this.flyers.forEach(sprite => {
      const flyer_sprite = new FlyingItem(this, {
        x: sprite.x,
        y: sprite.y,
        key: sprite.name,
        prefix: sprite.properties.filter(n => n.name === "prefix")[0].value,
        size: sprite.width,
        startFrame: sprite.properties.filter(n => n.name === "startFrame")[0]
          .value,
        endFrame: sprite.properties.filter(n => n.name === "endFrame")[0].value
      });
      this.flyingSprites.push(flyer_sprite);
    });
  }

  create() {
    this.keys = this.input.keyboard.createCursorKeys();
    this.keys.x = this.input.keyboard.addKey("x");
    this.keys.space = this.input.keyboard.addKey("space");

    this.setupMap();

    this.spawnPoints = this.map.getObjectLayer("SpawnPoints");

    this.setupPlayer();

    this.nonMovingKillers = this.physics.add.staticGroup();
    this.movingKillers = this.physics.add.group();

    this.setupWaterAndBones();

    this.setupCampfire();
    this.setupWaterHand();
    this.setupBoss();
    this.setupFlyingObjects();

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

  checkSpawnPosition(playerX) {
    this.playerSpawnPoints.forEach( point => {
      let type = parseInt(point.type,10);
      let x = point.x
      if (playerX > x ) {
        spawnPointNum = type
      }
    })
  }

  update(time, delta) {
    this.player.update(this.keys);
    this.boss.update(time, delta);
    this.flyingSprites.forEach(x => x.update(time, delta));
    this.checkSpawnPosition(this.player.x)

    if (this.cameras.main.scrollX >= 1728) {
      this.cameras.main.stopFollow()
    }
  }

  startOver(sprite1, sprite2) {
    if (this.deathTimeout) return;

    if (sprite1 instanceof FlyingItem) {
      sprite1.stopFlying()
    }
    if (sprite2 instanceof FlyingItem) {
      sprite2.stopFlying()
    }

    this.player.death();
    this.deathTimeout = setTimeout(() => {
      this.scene.restart();
      this.deathTimeout = null;
    }, 750);
  }
}
