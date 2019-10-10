
export default function(scene) {
  /**
   * The water hand that rises from the water
   */
  const handFrames = scene.anims.generateFrameNames("all_sprites", {
    prefix: '16x16/hand/',
    start: 0,
    end: 16,
    zeroPad: 1,
    suffix: ".png"
  })

  scene.anims.create({
    key: "water_hand_rise",
    frames: handFrames,
    frameRate: 10,
    repeat: -1,
    repeatDelay: 2000
  });

  /**
   * The campire animations
   */
  scene.anims.create({
    key: "campfire_burn",
    frames: scene.anims.generateFrameNames("all_sprites", {
      start: 0,
      end: 3,
      zeroPad: 1,
      prefix: "8x8/campfire-sprite-",
      suffix: ".png"
    }),
    frameRate: 10,
    repeat: -1
  });

  /** 
   * the river water 
   */
  const waterFrames = [
    {key: "all_sprites", frame: "8x8/water/0.png"},
    {key: "all_sprites", frame: "8x8/water/1.png"}
  ]

  scene.anims.create({
    key: "river_water",
    frames: waterFrames,
    frameRate: 1,
    repeat: -1
  });

  /** 
   * the boss floating
   */
  scene.anims.create({
    key: "boss_float",
    frames: scene.anims.generateFrameNames("all_sprites", {
      prefix: "16x32/fireball/",
      start: 0,
      end: 6,
      zeroPad: 1,
      suffix: ".png"
    }),
    frameRate: 15,
    repeat: -1
  });
  
  /** 
   * the boss death
   */
  scene.anims.create({
    key: "boss_death",
    frames: scene.anims.generateFrameNames("all_sprites", {
      prefix: "16x32/fireball/",
      start: 7,
      end: 15,
      zeroPad: 1,
      suffix: ".png"
    }),
    frameRate: 10,
    repeat: 0
  });

  const i = scene.playerNum === 2 ? 8 : 0;
  /** 
   * Player 1
   */
  scene.anims.create({
    key: "player_stand",
    frames: [{key: "all_sprites", frame: `16x16/player/${0+i}.png` }]
  });
  scene.anims.create({
    key: "player_jump",
    frames: [{key: "all_sprites", frame: `16x16/player/${6+i}.png` }]
  });
  scene.anims.create({
    key: "player_crouch",
    frames: [{key: "all_sprites", frame: `16x16/player/${5+i}.png` }]
  });
  scene.anims.create({
    key: "player_hurt",
    frames: [
      {key: "all_sprites", frame: `16x16/player/${7+i}.png` },
      {key: "all_sprites", frame: `16x16/blank.png` }
    ],
    frameRate: 10,
    repeat: -1
  });
  scene.anims.create({
    key: "player_run",
    frames: scene.anims.generateFrameNames("all_sprites", {
      prefix: "16x16/player/",
      start: 1 + i,
      end: 4 + i,
      zeroPad: 1,
      suffix: ".png"
    }),
    frameRate: 10,
    repeat: 0
  });
}