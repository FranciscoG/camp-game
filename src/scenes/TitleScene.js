import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: "TITLE" });
  }

  create() {
    this.keys = {
      x : this.input.keyboard.addKey('x'),
      space : this.input.keyboard.addKey('space'),
      enter : this.input.keyboard.addKey('enter')
    }

    this.add.sprite(0,0,"all_sprites","screens/title-screen.png");
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
