import globals from "./global.js";

export default function update(time, delta) {
  if (globals.keys.left.isDown) {
    globals.player.body.setVelocityX(-200);
    globals.player.anims.play("walk", true); // walk left
    globals.player.flipX = true; // flip the sprite to the left
  } else if (globals.keys.right.isDown) {
    globals.player.body.setVelocityX(200);
    globals.player.anims.play("walk", true);
    globals.player.flipX = false; // use the original sprite looking to the right
  } else {
    globals.player.body.setVelocityX(0);
    globals.player.anims.play("idle", true);
  }
  // jump
  if (globals.keys.up.isDown && globals.player.body.onFloor()) {
    globals.player.body.setVelocityY(-500);
  }
}
