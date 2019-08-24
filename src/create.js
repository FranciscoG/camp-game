import globals from "./global.js";
// import collectCoin from "./collect-coin.js"

export default function create() {
  globals.keys = this.input.keyboard.createCursorKeys();
  // load the map 
  globals.map = this.make.tilemap({key: 'map'});

  // tiles for the ground layer
  var groundTiles = globals.map.addTilesetImage('tiles');
  // create the ground layer
  globals.groundLayer = globals.map.createDynamicLayer('World', groundTiles, 0, 0);
  // the player will collide with this layer
  globals.groundLayer.setCollisionByExclusion([-1]);

  // coin image used as tileset
//   var coinTiles = globals.map.addTilesetImage('coin');
  // add coins as tiles
//   globals.coinLayer = globals.map.createDynamicLayer('Coins', coinTiles, 0, 0);

  // set the boundaries of our game world
  this.physics.world.bounds.width = globals.groundLayer.width;
  this.physics.world.bounds.height = globals.groundLayer.height;

  // create the player sprite    
  globals.player = this.physics.add.sprite( 16, 16, 'player');
  globals.player.setBounce(0.1); // our player will bounce from items
  globals.player.setCollideWorldBounds(true); // don't go out of the map    
  
  // small fix to our player images, we resize the physics body object slightly
//   globals.player.body.setSize(globals.player.width, globals.player.height-8);
  
  // player will collide with the level tiles 
  this.physics.add.collider(globals.groundLayer, globals.player);

//   globals.coinLayer.setTileIndexCallback(17, collectCoin, this);
  // when the player overlaps with a tile with index 17, collectCoin 
  // will be called    
//   this.physics.add.overlap(globals.player, globals.coinLayer);

  // player walk animation
  this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('player', {prefix: 'running', start: 1, end: 3, zeroPad: 2}),
      frameRate: 10,
      repeat: -1
  });
  // idle with only one frame, so repeat is not neaded
  this.anims.create({
      key: 'idle',
      frames: [{key: 'player', frame: 'standing'}],
      frameRate: 10,
  });

  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(0, 0, globals.map.widthInPixels, globals.map.heightInPixels);
  // make the camera follow the player
  this.cameras.main.startFollow(globals.player);

  // set background color, so the sky is not black    
  this.cameras.main.setBackgroundColor('#ccccff');

  // this text will show the score
  globals.text = this.add.text(20, 570, '0', {
      fontSize: '20px',
      fill: '#ffffff'
  });
  // fix the text to the camera
  globals.text.setScrollFactor(0);
}
