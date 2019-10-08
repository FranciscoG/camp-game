import Phaser from "phaser";

export default class BookCoverScene extends Phaser.Scene {
  constructor() {
    super({ key: "BOOK" });
  }

  create() {
    this.scale.setGameSize(520, 480);
    this.scale.setZoom(1)

    this.keys = {
      x : this.input.keyboard.addKey('x'),
      space : this.input.keyboard.addKey('space'),
      enter : this.input.keyboard.addKey('enter')
    }

    this.add.image(520/2, 480/2, "bookCover")
  }

  update() {
  if (this.keys.x.isDown 
      || this.keys.space.isDown
      || this.keys.enter.isDown
    ) {
      this.scene.start("MENU");
    }
  }
}
