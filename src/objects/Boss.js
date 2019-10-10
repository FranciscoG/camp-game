import Phaser from "phaser";
import FlyingItem from "../objects/FlyingItem";

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, spawnData, onBossDeath) {
    super(scene, spawnData.x + 8, spawnData.y + 16, "boss");
    this.scene = scene;
    this.scene.add.existing(this);
    this.onBossDeath = onBossDeath;
    this.scene.physics.add.existing(this);
    this.setOrigin(0, 1);
    this.body.allowGravity = false;
    this.body.setSize(16 - 2, 16);
    this.setOffset(0, 12);
    this.anims.play("boss_float", true);
    this.setActive(false);
    this.setVisible(false);
    this.skullCount = 0;
    this.bossDead = false;
  }

  addSkulls() {
    this.skull = new FlyingItem(this.scene, {
      x: this.x + 2,
      y: this.y + 4,
      key: "skull",
      prefix: "8x8/skull/",
      startFrame: 0,
      endFrame: 3,
      size: 8,
      autoStart: true
    });
    // make the skull a little faster
    this.skull.body.setVelocityX(-60);
    this.scene.soundFx.play("fireball")
  }

  respawnSkull() {
    this.scene.soundFx.play("fireball")
    this.skull.x = this.x;
    this.skull.setActive(true);
    this.skull.setVisible(true);
    this.skullCount++;
  }

  bossDying() {
    this.bossDead = true;
    this.anims.play("boss_death", true);
    setTimeout(() => {
      this.onBossDeath(this.x, this.y);
      this.destroy();
    }, 1000);
  }

  update(time, delta) {
    if (this.bossDead) {
      return;
    }

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
      this.bossDying();
      return;
    }

    if (this.active) {
      return;
    }

    if (
      this.scene.cameras.main.worldView.contains(this.x, this.y) &&
      this.scene.cameras.main.scrollX >= 1728
    ) {
      this.setActive(true);
      this.setVisible(true);
      setTimeout(() => {
        this.addSkulls();
      }, 1000);
    }
  }
}
