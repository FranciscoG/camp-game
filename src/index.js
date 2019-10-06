import Phaser from "phaser";
import { LoadScene } from "./scenes/LoadScene";
import { PlayScene } from "./scenes/PlayScene";
import { MenuScene } from "./scenes/MenuScene";
import TitleScene from "./scenes/TitleScene";

// display resolution of the NES is 256 horizontal pixels by 240 vertical pixels.
// the map os 16 screens long at 128x120 (half NES)
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
      debug: window.location.search === "?debug",
      tileBias: 8
    }
  },
  scene: [LoadScene, TitleScene, MenuScene, PlayScene]
};

const game = new Phaser.Game(config);
