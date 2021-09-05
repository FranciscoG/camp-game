import Phaser from "phaser";
import BaseScene from "./BaseScene"

export default class BookCoverScene extends BaseScene {
  constructor() {
    super({ key: "BOOK" });
  }

  create() {
    this.scale.setGameSize(520, 480);
    this.scale.setZoom(1)
    this.baseControls()

    this.add.image(520/2, 480/2, "bookCover")
  }

  update() {
  if (this.actionKeyDown) {
      this.scene.start("CREDITS");
    }
  }
}
