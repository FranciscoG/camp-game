import globals from "./global.js";

export default function update(time, delta) {
  if (globals.keys.left.isDown) {
    globals.player.body.setVelocityX(-75);
    globals.player.anims.play("running", true); // walk left
    globals.player.flipX = true; // flip the sprite to the left
  } else if (globals.keys.right.isDown) {
    globals.player.body.setVelocityX(75);
    globals.player.anims.play("running", true);
    globals.player.flipX = false; // use the original sprite looking to the right
  } else if (globals.player.body.onFloor()) {
    globals.player.body.setVelocityX(0);
    globals.player.anims.play("standing", true);
  }

  if (globals.keys.up.isDown && globals.player.body.onFloor()) {
    globals.player.body.setVelocityY(-75);
  }

  if (!globals.player.body.onFloor()) {
    globals.player.anims.play("jump_hold", true);
  }
  
}
