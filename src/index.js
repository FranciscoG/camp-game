import Phaser from "phaser"
import preload from "./preload"
import create from "./create"

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 200 }
      }
  },
  scene: {
      preload: preload,
      create: create
  }
};

const game = new Phaser.Game(config);

