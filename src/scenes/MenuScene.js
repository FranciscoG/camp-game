import Phaser from "phaser";
import PlayerSprite from "../objects/Player";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MENU" });
    this.keys = {};
    this.playerNum = 1
  }

  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    this.player1 = new PlayerSprite(this, 40, 49, 1)
    this.player1.setupAnimations();
    this.player1.running()

    this.player2 = new PlayerSprite(this, 88, 49, 2)
    this.player2.setupAnimations();
    this.player2.stand()

    let action = this.add.text(
      16,
      88,
      "Select a character and press SPACE to start",
      { fontSize: "6px", fill: "#FFF" }
    );
  }

  update() {
    if (this.keys.left.isDown) {
      this.player1.running()
      this.player2.stand()
      this.playerNum = 1
    } else if (this.keys.right.isDown) {
      this.player1.stand()
      this.player2.running()
      this.playerNum = 2
    } else if (this.keys.space.isDown) {
      // set global player and start the next scene
      this.scene.start("PLAY", {playerNum: this.playerNum} );
    }
  }
}
