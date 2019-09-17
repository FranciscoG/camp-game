import Phaser from "phaser"
import campMap from "../assets/camp.json"
import campMapTiles from "../assets/tileset.png"
import playersSprites from "../assets/player-sprite-sheet.png"
import playersJson from "../assets/player-sprites.json"

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({
      key: "LOAD"
    })
  }

  preload() {
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

    this.load.on("progress", (percent) => {
      loadingBar.fillRect(
        0,
        this.game.renderer.height / 2, 
        this.game.renderer.height * percent,
        20
      );
      console.log(percent);
    })
  }

  create() {
    this.scene.start("PLAY");
  }
}
