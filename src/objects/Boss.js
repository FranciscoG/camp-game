import Phaser from "phaser";

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, spawnData) {
    super(scene, spawnData.x, spawnData.y + 32, "boss");
    scene.add.existing(this);
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.setOrigin(0,1)
    this.body.allowGravity = false
    this.body.setSize(16, 16);
    this.setupAnimations()
  }

  setupAnimations() {
    this.scene.anims.create({
      key: 'boss_float',
      frames: this.scene.anims.generateFrameNames("boss16x32", {
        prefix: 'fireball-',
        start: 1,
        end: 7,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.play('boss_float', true);
  }

  update(time, delta) {
  }
}
