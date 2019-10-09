import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles/dist/AnimatedTiles.js";
import PlayerSprite from "../objects/Player";
import Boss from "../objects/Boss";
import FlyingItem from "../objects/FlyingItem";
import setupAnimations from "../objects/animations";

var debugStart = parseInt(location.hash.substring(1), 10);
if (isNaN(debugStart) || !debugStart) {
  debugStart = 1;
}
var spawnPointNum = debugStart;

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
    this.spawnPoints.objects
      .filter(f => f.name === "water_hand")
      .forEach(tile => {
        let obj = this.nonMovingKillers.create(
          tile.x + 8,
          tile.y + 8,
          "itemsAndEnemies",
          "16x16/hand/0.png"
        );
        const hitWidth = tile.width - 10;
        obj.body.setSize(hitWidth, 0);
        this.anims.play("water_hand_rise", obj);
        obj.on("animationupdate-water_hand_rise", function(anim, frame) {
          if (frame.index >= 3) {
            obj.body.setSize(hitWidth, 16 - (frame.index - 3));
          } else {
            obj.body.setSize(hitWidth, 0);
          }
        });
      });
  }

  setupCampfire() {
    this.spawnPoints.objects
      .filter(f => f.name === "camp_fire")
      .forEach(tile => {
        let obj = this.nonMovingKillers.create(
          tile.x,
          tile.y + 4,
          "itemsAndEnemies",
          "8x8/campfire-sprite-0.png"
        );
        obj.body.setSize(tile.width - 3, tile.height - 1);
        this.anims.play("campfire_burn", obj);
      });
  }

  setupBeads() {
    this.beadGroup = this.physics.add.staticGroup();
    this.spawnPoints.objects
      .filter(f => f.name === "bead")
      .forEach((bead, i) => {
        let obj = this.beadGroup.create(
          bead.x,
          bead.y + 2,
          "itemsAndEnemies",
          `8x8/beads/${i}.png`
        );
        obj.setOrigin(0, 0)
        obj.body.setSize(bead.width, bead.height);
      });

    this.physics.add.overlap(
      this.player,
      this.beadGroup,
      this.updateText,
      null,
      this
    );
  }

  setupWaterAndBones() {
    this.map.getObjectLayer("PitObjects").objects.forEach(tile => {
      if (tile.name === "bones") {
        let bones = this.nonMovingKillers.create(
          tile.x + 4,
          tile.y + 4,
          "itemsAndEnemies",
          "8x8/blank.png"
        );
        bones.body.width = tile.width;
        bones.body.height = tile.height;
      } else if (tile.name === "water") {
        let water = this.nonMovingKillers.create(
          tile.x + 4,
          tile.y + 4,
          "itemsAndEnemies",
          "8x8/water/0.png"
        );
        water.body.width = tile.width;
        water.body.height = tile.height;
        water.body.setSize(tile.width, tile.height);
        this.anims.play("river_water", water);
      }
    });
  }

  setupPlayer() {
    // get player spawn point
    this.playerSpawnPoints = this.spawnPoints.objects.filter(
      o => o.name === "player_spawn"
    );

    const point = this.playerSpawnPoints.filter(
      x => parseInt(x.type, 10) === spawnPointNum
    )[0];

    // create the player sprite
    this.player = new PlayerSprite(this, point.x, point.y, this.playerNum);
    this.player.usePhysics();

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

    // create the player sprite
    this.boss = new Boss(this, bossSpawn, this.addLocket.bind(this));

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

  addLocket(x, y) {
    this.locket = this.physics.add.sprite(
      x,
      y - 16,
      "itemsAndEnemies",
      "locket.png"
    );
    this.locket.setCollideWorldBounds(true);

    this.locket.body.setSize(12, 12);
    this.locket.body.setImmovable(true);
    this.physics.add.collider(this.locket, this.groundLayer);
    this.physics.add.overlap(
      this.locket,
      this.player,
      this.grabLocket,
      null,
      this
    );
  }

  grabLocket() {
    this.locket.destroy();
    this.scene.start("BOOK");
  }

  setupText() {
    var config = {
      image: "retro_font",
      width: 8,
      height: 8,
      chars: Phaser.GameObjects.RetroFont.TEXT_SET3,
      charsPerRow: 11,
      spacing: { x: 0, y: 0 }
    };

    this.cache.bitmapFont.add(
      "retro_font",
      Phaser.GameObjects.RetroFont.Parse(this, config)
    );
    
    this.beadCount = 0
    this.beadText = this.add.bitmapText(0, 0, "retro_font", "BEADS 0");
    this.beadText.setScrollFactor(0)
  }

  updateText(player, beadSprite) {
    beadSprite.destroy()
    this.beadCount++
    this.beadText.setText(`BEADS ${this.beadCount}`)
  }

  create() {
    this.keys = this.input.keyboard.createCursorKeys();
    this.keys.x = this.input.keyboard.addKey("x");
    this.keys.space = this.input.keyboard.addKey("space");

    setupAnimations(this);

    this.setupMap();

    this.spawnPoints = this.map.getObjectLayer("SpawnPoints");
    this.nonMovingKillers = this.physics.add.staticGroup();
    this.movingKillers = this.physics.add.group();

    this.setupPlayer();
    this.setupCampfire();
    this.setupWaterAndBones();
    this.setupWaterHand();
    this.setupBoss();
    this.setupFlyingObjects();
    this.setupBeads();
    this.setupText()

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

    if (!this.music) {
      this.music = this.sound.addAudioSprite("music");
      this.music.play("stage");
    }
  }

  checkSpawnPosition(playerX) {
    this.playerSpawnPoints.forEach(point => {
      let type = parseInt(point.type, 10);
      let x = point.x;
      if (playerX > x) {
        spawnPointNum = type;
      }
    });
  }

  update(time, delta) {
    this.player.update(this.keys);
    this.boss.update(time, delta);
    this.flyingSprites.forEach(x => x.update(time, delta));
    this.checkSpawnPosition(this.player.x);

    if (this.cameras.main.scrollX >= 1728) {
      this.cameras.main.stopFollow();

      if (this.music.currentMarker.name !== "boss") {
        this.music.play("boss");
      }
    }
  }

  startOver(sprite1, sprite2) {
    if (this.deathTimeout) return;

    if (sprite1 instanceof FlyingItem) {
      sprite1.stopFlying();
    }
    if (sprite2 instanceof FlyingItem) {
      sprite2.stopFlying();
    }

    this.player.death();
    this.deathTimeout = setTimeout(() => {
      this.scene.restart();
      this.deathTimeout = null;
    }, 750);
  }
}
