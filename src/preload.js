import mapJson from "./assets/camp.json"
import tiles from "./assets/tileset.png"

import playerImg from "./assets/tez-sprite-sheet.png"
import playerJson from "./assets/tez.json"

export default function preload() {
  // map made with Tiled in JSON format
  this.load.tilemapTiledJSON("map", mapJson);

  // tiles in spritesheet
  this.load.spritesheet("tiles", tiles, {
    frameWidth: 8,
    frameHeight: 8
  });
  
  
  // player animations
  this.load.atlas("player", playerImg, playerJson);
}
