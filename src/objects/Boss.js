import Phaser from "phaser";
import FlyingItem from "../objects/FlyingItem";

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, spawnData, onBossDeath) {
    super(scene, spawnData.x, spawnData.y + 32, "boss");
    scene.add.existing(this);
    this.scene = scene;
    this.onBossDeath = onBossDeath;
    this.scene.physics.add.existing(this);
    this.setOrigin(0, 1);
    this.body.allowGravity = false;
    this.body.setSize(16 - 2, 16);
    this.setOffset(0, 12);
    this.setupAnimations();
    this.setActive(false);
    this.setVisible(false);
    this.skullCount = 0;
    this.bossDead = false;
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
      frameRate: 15,
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
    // make the skull a little faster
    this.skull.body.setVelocityX(-60);
  }

  respawnSkull() {
    this.skull.x = this.x;
    this.skull.setActive(true);
    this.skull.setVisible(true);
    this.skullCount++;
  }

  update(time, delta) {
    if (this.bossDead) { return; }

    if (
      this.skull &&
      this.skullCount < 3 &&
      !this.scene.cameras.main.worldView.contains(this.skull.x, this.skull.y)
    ) {
      this.respawnSkull();
    }
    
    if (
      this.skull &&
      this.skullCount >= 3 &&
      !this.scene.cameras.main.worldView.contains(this.skull.x, this.skull.y)
    ) {
      this.onBossDeath(this.x, this.y);
      this.bossDead = true
      this.destroy()
      return;
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
