import BaseScene from "./BaseScene";

/**
 * The scene that occurs right after you beat the boss
 */
export default class EndScene extends BaseScene {
  constructor() {
    super({ key: "END" });
  }

  create() {
    this.baseControls();
    this.creditImage = this.add.sprite(
      0,
      0,
      "all_sprites",
      "screens/congrats.png"
    );
    this.sound.stopAll();
    this.music = this.sound.addAudioSprite("game_audio");
    this.music.play("stage");

    this.volumeControl();
  }

  update() {
    if (this.actionKeyDown) {
      this.scene.start("BOOK");
    }
  }
}
