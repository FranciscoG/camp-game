import Phaser from "phaser";
import campMap from "../assets/camp.json";
import campMapTiles from "../assets/tileset.png";
import mainScreensSprites from "../assets/main_screens.png";
import mainScreensJson from "../assets/main_screens.json";
import bookcover from "../assets/book-cover-screen-4x.png";
import pixelFontimg from "../assets/font/pixel_font.png";
import itemsAndEnemies from "../assets/items_and_enemies.json";
import "../assets/items_and_enemies.png";
import mp3 from "../assets/audio/gamemusic.mp3";
import audioSpriteJson from "../assets/audio/gamemusic.json";

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LOAD"
    });
  }

  preload() {
    /***********************************************
     * audio
     */
    this.load.audioSprite("game_audio", audioSpriteJson, [mp3]);

    /***********************************************
     * SpriteSheets and images
     */
    this.load.multiatlas("itemsAndEnemies", itemsAndEnemies, "assets");

    // main screens (title, player select, credits) and all npc items and stuff
    this.load.atlas("main_screens", mainScreensSprites, mainScreensJson);
    this.load.image("bookCover", bookcover);
    this.load.image("retro_font", pixelFontimg);

    /***********************************************
     * Map
     */
    this.load.tilemapTiledJSON("map", campMap);

    // map tiles in spritesheet
    this.load.spritesheet("tileset", campMapTiles, {
      frameWidth: 8,
      frameHeight: 8
    });

    /***********************************************
     * Loading Bar
     */
    let loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff //white
      }
    });

    var barMaxWidth = this.game.renderer.width / 3;
    this.load.on("progress", percent => {
      loadingBar.fillRect(
        barMaxWidth, // x
        this.game.renderer.height / 2 - 7, // y
        barMaxWidth * percent, // w
        10 // h
      );
    });
  }

  create() {
    if (this.sys.game.device.os.desktop) {
      console.log("desktop");
    } else {
      console.log("mobile");
    }

    if (window.location.search === "?debug") {
      this.scene.start("PLAY");
    } else {
      this.scene.start("TITLE");
    }
  }
}
