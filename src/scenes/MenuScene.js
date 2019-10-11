import BaseScene from "./BaseScene"

export class MenuScene extends BaseScene {
  constructor() {
    super({ key: "MENU" });
    this.playerNum = 1;
  }

  create() {
    this.scale.setGameSize(128, 120);
    this.scale.setZoom(4);
    this.keys = this.input.keyboard.createCursorKeys();
    
    this.sprite1 = this.add.sprite(
      0,
      0,
      "all_sprites",
      "screens/player-select-01.png"
    );
    this.sprite2 = this.add.sprite(
      0,
      0,
      "all_sprites",
      "screens/player-select-02.png"
    );
    this.sprite2.visible = false;

    this.sound.stopAll();
    this.volumeControl()
    this.baseControls()
  }

  update() {
    if (this.keys.left.isDown) {
      this.sprite2.visible = false;
      this.playerNum = 1;
    } else if (this.keys.right.isDown) {
      this.sprite2.visible = true;
      this.playerNum = 2;
    } else if (this.actionKeyDown) {
      // set global player and start the next scene
      this.scene.start("PLAY", { playerNum: this.playerNum });
    }
  }
}
