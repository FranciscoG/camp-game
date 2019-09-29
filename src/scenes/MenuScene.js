import Phaser from "phaser";

import playersSprites from "../assets/player-sprite-sheet.png";
import playersJson from "../assets/player-sprites.json";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MENU" });
    this.keys = {};
    this.playerNum = 1
  }

  preload() {
    // p1
    this.anims.create({
      key: "p1_standing",
      frames: [{ key: "player", frame: "p1_stand" }],
      frameRate: 10
    });

    // p1 walk animation
    this.anims.create({
      key: "p1_running",
      frames: this.anims.generateFrameNames("player", {
        prefix: "p1_run",
        start: 1,
        end: 4,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });

    // p2
    this.anims.create({
      key: "p2_standing",
      frames: [{ key: "player", frame: "p2_stand" }],
      frameRate: 10
    });

    // p2 walk animation
    this.anims.create({
      key: "p2_running",
      frames: this.anims.generateFrameNames("player", {
        prefix: "p2_run",
        start: 1,
        end: 4,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });
  }

  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    this.player1 = this.add.sprite(40, 49, "player");
    this.player1.anims.play("p1_running", true);

    this.player2 = this.add.sprite(88, 49, "player");
    this.player2.anims.play("p2_standing", true);

    let action = this.add.text(
      16,
      88,
      "Select a character and press SPACE to start",
      { fontSize: "4px", fill: "#FFF" }
    );
  }

  update() {
    if (this.keys.left.isDown) {
      this.player1.anims.play("p1_running", true);
      this.player2.anims.play("p2_standing", true);
      this.playerNum = 1
    } else if (this.keys.right.isDown) {
      this.player1.anims.play("p1_standing", true);
      this.player2.anims.play("p2_running", true);
      this.playerNum = 2
    } else if (this.keys.space.isDown) {
      // set global player and start the next scene
      this.scene.start("PLAY", {playerNum: this.playerNum} );
    }
  }
}
