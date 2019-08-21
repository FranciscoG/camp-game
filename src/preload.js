import mapJson from "./assets/map.json"
import tiles from "./assets/tiles.png"
import coinGold from "./assets/coinGold.png"
import playerImg from "./assets/player.png"
import playerJson from "./assets/player.json"

export default function preload() {
  // map made with Tiled in JSON format
  this.load.tilemapTiledJSON("map", mapJson);
  // tiles in spritesheet
  this.load.spritesheet("tiles", tiles, {
    frameWidth: 70,
    frameHeight: 70
  });
  // simple coin image
  this.load.image("coin", coinGold);
  // player animations
  this.load.atlas("player", playerImg, playerJson);
}
