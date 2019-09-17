import Phaser from "phaser";

import playersSprites from "../assets/player-sprite-sheet.png"
import playersJson from "../assets/player-sprites.json"

class TitleScene extends Phaser.Scene {
  constructor() {
    super({key: 'TitleScene'})
    this.keys = {}
  }
  
  preload () {
    // player animations
    this.load.atlas("player", playersSprites, playersJson);
  }
  
  create () {
    this.keys = this.input.keyboard.createCursorKeys();
  }
}

export default TitleScene;