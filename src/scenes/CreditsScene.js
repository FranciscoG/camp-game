import Phaser from "phaser";

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super({ key: "CREDITS" });
  }

  create() {
    this.scale.setGameSize(128, 120);
    this.scale.setZoom(4)

    this.keys = {
      x : this.input.keyboard.addKey('x'),
      space : this.input.keyboard.addKey('space'),
      enter : this.input.keyboard.addKey('enter')
    }

    this.creditImage = this.add.sprite(0,0,"main_screens","credits");
    this.creditImage.setOrigin(0,0)

    this.sound.stopAll()
    this.music = this.sound.addAudioSprite('game_audio')
    this.music.play('stage')
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
