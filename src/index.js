import Phaser from "phaser";
import {LoadScene} from './scenes/LoadScene'
import {PlayScene} from './scenes/PlayScene'

// display resolution of the NES is 256 horizontal pixels by 240 vertical pixels.
// 16 screens long at 128x120
// tiles are 8px so screen is 16 x 15 tiles

var config = {
  type: Phaser.AUTO,
  width: 128,
  height: 120,
  pixelArt: true,
  zoom: 4,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 120 * 4 },
      debug: false,
      tileBias: 8
    }
  },
  scene: [
    LoadScene,
    PlayScene
  ]
};

const game = new Phaser.Game(config);