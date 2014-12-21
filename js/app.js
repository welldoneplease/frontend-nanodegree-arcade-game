// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // private variable which represents the rows
    // our enemies may start in
    var rows = [60, 143, 226];

    // Enemies should always start outside the playing field
    this.x = -101;

    // randomly select one of the rows to 'spawn' enemies in
    this.y = rows[Math.floor(Math.random()*rows.length)];

    // why not also use the row array to have 3 different speeds...
    this.speed = rows[Math.floor(Math.random()*rows.length)];

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // if the enemy is outside the playing field reset it,
    // thus having it start from the left again
    if (this.x > 500) {
      this.reset();
      return;
    }

    // update the enemy position based on its speed
    this.x += dt*this.speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemy reset
Enemy.prototype.reset = function() {
  var rows = [60, 143, 226];
  this.x = -101;
  this.y = rows[Math.floor(Math.random()*rows.length)];
  this.speed = rows[Math.floor(Math.random()*rows.length)];
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  // player starts in lawn center position
  this.x = 202;
  this.y = 380;
  this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dir) {
  // pass direction to switch case statements
  // make sure player isn't leaving boundaries
  // only then update player position
  switch (dir) {
    case 'up':
      if (this.y > 48) { this.y -= 83; }
      break;
    case 'down':
      if (this.y < 380) { this.y += 83; }
      break;
    case 'left':
      if (this.x > 0) { this.x -= 101; }
      break;
    case 'right':
      if (this.x < 404) { this.x += 101; }
      break;
    case 'default':
      console.log('no direction specified');
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(e) {
  // pass the input along to update method
  this.update(e);
};

Player.prototype.reset = function() {
  // put player back to starting position
  this.x = 202;
  this.y = 380;
};

var Exit = function() {
  this.x = [0, 101, 202, 303, 404][Math.floor(Math.random()*5)];
  this.y = -25;
  this.sprite1 = 'images/Rock.png';
  this.sprite2 = 'images/Key.png';
}

Exit.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite1), this.x, this.y);
  ctx.drawImage(Resources.get(this.sprite2), this.x, this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var exit = new Exit();
var allEnemies = [];

// for now spawning 3 enemies hardcoded
// TODO: have some variable enemy numbers?
for (var i = 0; i < 3; i++) {
  allEnemies.push(new Enemy());
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
