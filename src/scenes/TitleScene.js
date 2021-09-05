import BaseScene from "./BaseScene"

export default class TitleScene extends BaseScene {
  constructor() {
    super({ key: "TITLE" });
  }

  create() {
    this.add.sprite(0,0,"all_sprites","screens/title-screen.png");
    this.baseControls()
  }

  update() {
    if (this.actionKeyDown) {
      this.scene.start("MENU");
    }
  }
}
