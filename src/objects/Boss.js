import Phaser from "phaser";
import FlyingItem from "../objects/FlyingItem";

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, spawnData) {
    super(scene, spawnData.x, spawnData.y + 32, "boss");
    scene.add.existing(this);
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.setOrigin(0, 1);
    this.body.allowGravity = false;
    this.body.setSize(16 - 2, 16);
    this.setOffset(0, 12);
    this.setupAnimations();
    this.setActive(false);
    this.setVisible(false);
  }

  setupAnimations() {
    this.scene.anims.create({
      key: "boss_float",
      frames: this.scene.anims.generateFrameNames("boss16x32", {
        prefix: "fireball-",
        start: 1,
        end: 7,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.play("boss_float", true);
  }

  addSkulls() {
    this.skull = new FlyingItem(this.scene, {
      x: this.x + 2,
      y: this.y - 10,
      key: "skull",
      prefix: "skull-",
      startFrame: 1,
      endFrame: 4,
      size: 8,
      autoStart: true
    });
  }

  respawnSkull() {
    this.skull.x = this.x;
    this.skull.setActive(true);
    this.skull.setVisible(true);
  }

  update(time, delta) {
    if (
      this.skull &&
      !this.scene.cameras.main.worldView.contains(this.skull.x, this.skull.y)
    ) {
      this.respawnSkull();
    }
    if (this.active) {
      return;
    }
    if (this.scene.cameras.main.worldView.contains(this.x, this.y)) {
      this.setActive(true);
      this.setVisible(true);
      this.addSkulls();
    }
  }
}
