import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MENU" });
    this.playerNum = 1
  }

  create() {
    this.scale.setGameSize(128, 120);
    this.scale.setZoom(4)

    this.keys = this.input.keyboard.createCursorKeys()
    this.keys.x = this.input.keyboard.addKey('x')
    this.keys.space = this.input.keyboard.addKey('space')
    this.keys.enter = this.input.keyboard.addKey('enter')

    this.sprite1 = this.add.sprite(0,0,"all_sprites","screens/player-select-01.png");
    this.sprite2 = this.add.sprite(0,0,"all_sprites","screens/player-select-02.png");
    this.sprite2.visible = false

    this.sound.stopAll()
  }

  update() {
    if (this.keys.left.isDown) {
      this.sprite2.visible = false
      this.playerNum = 1
    } else if (this.keys.right.isDown) {
      this.sprite2.visible = true
      this.playerNum = 2
    } else if (this.keys.x.isDown 
      || this.keys.space.isDown
      || this.keys.enter.isDown) {
      // set global player and start the next scene
      this.scene.start("PLAY", {playerNum: this.playerNum} );
    }
  }
}
