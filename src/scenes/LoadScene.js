import Phaser from "phaser"
import campMap from "../assets/camp.json"
import campMapTiles from "../assets/tileset.png"
import playersSprites from "../assets/player-sprite-sheet.png"
import playersJson from "../assets/player-sprites.json"
import mainScreensSprites from "../assets/main_screens.png"
import mainScreensJson from "../assets/main_screens.json"

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LOAD"
    })
  }

  preload() {
    // main screens (title, player select, credits)
    this.load.atlas("main_screens", mainScreensSprites, mainScreensJson)

    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON("map", campMap);

    // tiles in spritesheet
    this.load.spritesheet("tileset", campMapTiles, {
      frameWidth: 8,
      frameHeight: 8
    });

    // player animations
    this.load.atlas("player", playersSprites, playersJson);


    //create loading bar
    let loadingBar = this.add.graphics({
      fillStyle: {
          color: 0xffffff //white
      }
    });

    var barMaxWidth = this.game.renderer.width / 3
    this.load.on("progress", (percent) => {
      loadingBar.fillRect(
        barMaxWidth,  // x
        (this.game.renderer.height / 2) - 7,  // y
        barMaxWidth * percent, // w
        10 // h
      );
    })
  }

  create() {
    this.scene.start("TITLE");
  }
}
