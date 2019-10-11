import Phaser from "phaser";

/**
 * The scene that occurs right after you beat the boss
 */
export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: "END" });
  }

  create() {
    this.keys = {
      x : this.input.keyboard.addKey('x'),
      space : this.input.keyboard.addKey('space'),
      enter : this.input.keyboard.addKey('enter')
    }

    this.creditImage = this.add.sprite(0,0,"all_sprites","screens/congrats.png");

    this.sound.stopAll()
    this.music = this.sound.addAudioSprite('game_audio')
    this.music.play('stage')
  }

  update() {
  if (this.keys.x.isDown 
      || this.keys.space.isDown
      || this.keys.enter.isDown
    ) {
      this.scene.start("BOOK");
    }
  }
}
