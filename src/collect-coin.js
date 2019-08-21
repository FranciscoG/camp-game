import globals from "./global.js";

export default function collectCoin(sprite, tile) {

  globals.coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
  globals.score++; // add 10 points to the score
  globals.text.setText(globals.score); // set the text to show the current score
  return false;
}