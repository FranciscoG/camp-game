import globals from "./global.js";

/*
- jump height: set to 16-pixel block; the top of his jump has his feet at 18 px off the ground.

- jump distance: clear 28 pixels of distance. The water he jumps over here is 24 pixels wide. 
*/

const RightRunVelocity = 75
const LeftRunVelocity = RightRunVelocity * -1
const JumpVelocity = 130 * -1

export default function update(time, delta) {
  if (globals.keys.left.isDown) {
    globals.player.body.setVelocityX(LeftRunVelocity);
    globals.player.anims.play("running", true); // walk left
    globals.player.flipX = true; // flip the sprite to the left
  } else if (globals.keys.right.isDown) {
    globals.player.body.setVelocityX(RightRunVelocity);
    globals.player.anims.play("running", true);
    globals.player.flipX = false; // use the original sprite looking to the right
  } else if (globals.player.body.onFloor()) {
    globals.player.body.setVelocityX(0);
    globals.player.anims.play("standing", true);
  }

  if (globals.keys.up.isDown && globals.player.body.onFloor()) {
    globals.player.body.setVelocityY(JumpVelocity);
  }

  if (!globals.player.body.onFloor()) {
    globals.player.anims.play("jump_hold", true);
  }
 
  // if player y is greater 88, kill player
  if (globals.player.y > 88) {
    // globals.player
  }
}
