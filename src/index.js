import Phaser from "phaser";
import preload from "./preload";
import create from "./create";
import update from "./update"

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    key: "main",
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);