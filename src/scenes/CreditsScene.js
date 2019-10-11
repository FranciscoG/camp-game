import Phaser from "phaser";

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super({ key: "CREDITS" });
  }

  create() {
    this.scale.setGameSize(128, 120);
    this.scale.setZoom(4);

    this.keys = {
      x: this.input.keyboard.addKey("x"),
      space: this.input.keyboard.addKey("space"),
      enter: this.input.keyboard.addKey("enter")
    };

    this.creditImage = this.add.sprite(
      0,
      0,
      "all_sprites",
      "screens/credits.png"
    );

    this.resetPlayerAnimations()
    
    // reset the spawn position back to 1
    const playScene = this.game.scene.getScene("PLAY")
    playScene.spawnPointNum = 1
    playScene.beads = []
  }

  resetPlayerAnimations() {
    [
      "player_stand",
      "player_jump",
      "player_crouch",
      "player_hurt",
      "player_run"
    ].forEach(e => this.anims.remove(e));
  }

  update() {
    if (
      this.keys.x.isDown ||
      this.keys.space.isDown ||
      this.keys.enter.isDown
    ) {
      this.scene.start("MENU");
    }
  }
}
