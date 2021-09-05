import BaseScene from "./BaseScene"

export default class CreditsScene extends BaseScene {
  constructor() {
    super({ key: "CREDITS" });
  }

  create() {
    this.scale.setGameSize(128, 120);
    this.scale.setZoom(4);
    this.baseControls()

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
    if (this.actionKeyDown) {
      this.scene.start("MENU");
    }
  }
}
