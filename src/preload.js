import campMap from "./assets/camp.json"
import campMapTiles from "./assets/tileset.png"

import playerImg from "./assets/tez-sprite-sheet.png"
import playerJson from "./assets/tez.json"

/**
 * Character size: 16 x 16
 * World tile size: 8 x 8
 */

export default function preload() {
  // map made with Tiled in JSON format
  this.load.tilemapTiledJSON("map", campMap);

  // tiles in spritesheet
  this.load.spritesheet("tileset", campMapTiles, {
    frameWidth: 8,
    frameHeight: 8
  });
  
  // player animations
  this.load.atlas("player", playerImg, playerJson);
}
