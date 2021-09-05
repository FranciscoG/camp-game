import Phaser from "phaser";

export default class BaseScene extends Phaser.Scene {
  

  baseControls() {
    this.keys = this.keys || {}
    this.keys.x = this.input.keyboard.addKey('x');
    this.keys.space = this.input.keyboard.addKey('space');
    this.keys.enter = this.input.keyboard.addKey('enter');
  }

  get actionKeyDown() {
    return this.keys.x.isDown || this.keys.space.isDown || this.keys.enter.isDown
  }

  toggleVolume() {
    if (this.vol_on.visible) { // sound is on
      this.sound.pauseAll()
      this.sound.mute = true
    } else {
      this.sound.mute = false
      this.sound.resumeAll()
    }

    this.vol_off.visible = !this.vol_off.visible
    this.vol_on.visible = !this.vol_on.visible
  }

  volumeControl() {
  
    this.vol_off = this.add.sprite(
      this.game.config.width,
      this.game.config.height,
      "all_sprites",
      "speaker-1.png"
    );

    this.vol_off.visible = this.sound.mute;
    this.vol_off.setScrollFactor(0)

    this.vol_on = this.add.sprite(
      this.game.config.width,
      this.game.config.height,
      "all_sprites",
      "speaker-0.png"
    );
    this.vol_on.visible = !this.sound.mute
    this.vol_on.setScrollFactor(0)

    const volButton = this.add.rectangle(
      this.game.config.width - 6.5,
      this.game.config.height - 6.5,
      13,
      13, 
      0x000000,
      0
    )
    volButton.setScrollFactor(0)

    volButton.setInteractive()
    volButton.on('pointerup', this.toggleVolume.bind(this));

    const muteKey = this.input.keyboard.addKey('m')
    muteKey.on('up', this.toggleVolume.bind(this));
  }

}
