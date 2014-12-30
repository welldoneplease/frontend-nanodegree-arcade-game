// Enemies our player must avoid
var Enemy = function() {
    // rows in which our enemies may start in
    this.rows = [60, 143, 226];

    // Enemies should always start outside the playing field
    this.x = -101;

    // randomly select one of the rows to 'spawn' enemies in
    this.y = this.rows[Math.floor(Math.random()*this.rows.length)];

    // give the enemy some random speed between 100 - 300
    // which seems fair enough...
    this.speed = Math.floor(Math.random() * (300 - 100)) + 100;

    // The image/sprite for our enemies, this uses
    this.sprite = 'images/enemy-bug.png';
};

// Parameter: dt, a time delta between ticks
Enemy.prototype = {
    // slow enemies movement down
    // kinda nice effect when player reaches key
    slowMo: function() {
        this.speed = this.speed/10;
    },
    update: function(dt) {
        // if the enemy is outside the playing field reset it,
        // thus having it start from the left again
        if (this.x > 500) {
            this.reset();
            return;
        }

        // update the enemy position based on its speed
        this.x += dt*this.speed;
    },
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },
    reset: function() {
        this.x = -101;
        this.y = this.rows[Math.floor(Math.random()*this.rows.length)];
    }
};

// reset Enemy 'class' constructor
// needed after ... .prototype = {...};
Enemy.prototype.constructor = Enemy;


// Our Player Class
var Player = function() {
    // player starts in lawn center position
    this.enableInput = true;
    // did the player reach the key on the rock yet?
    this.key = false;
    this.x = 202;
    this.y = 380;
    this.sprite = 'images/char-cat-girl.png';
};

Player.prototype = {
    update: function(dir) {
        // pass direction to switch case statements
        // make sure player isn't leaving boundaries
        // only then update player position
        if (this.enableInput) {
            switch (dir) {
                case 'up':
                    if (this.y > 48 ) {
                    this.y -= 83;
                    // player stands underneath the rock
                    // let him jump up one square
                    } else if (this.x === exit.x) {
                    this.y -= 83;
                    this.exits();
                    }
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
        }
    },
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },
    exits: function() {
        // player stands on the rock and got the key
        exit.sprite2 = null;
        this.key = true;
    },
    handleInput: function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        // pass the input along to update method
        this.update(allowedKeys[e.keyCode]);
    },
    reset: function() {
        // put player back to starting position
        // remove key and enable inputs
        this.x = 202;
        this.y = 380;
        this.key = false;
        this.enableInput = true;
    }
};

// reset Player 'class' constructor
// needed after ... .prototype = {...};
Player.prototype.constructor = Player;


// Exit class - which is basically the rock with the key
var Exit = function() {
    // make sure the rock appear on a random spot
    this.x = [0, 101, 202, 303, 404][Math.floor(Math.random()*5)];
    this.y = -25;
    this.sprite1 = 'images/Rock.png';
    this.sprite2 = 'images/Key.png';
};

Exit.prototype = {
    reset: function() {
        this.x = [0, 101, 202, 303, 404][Math.floor(Math.random()*5)];
        this.sprite2 = 'images/Key.png';

        // to clean key on upper screen
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,505,50);
    },
    render: function() {
        ctx.drawImage(Resources.get(this.sprite1), this.x, this.y);
        // render key only if available
        // remove key when player stands on rock
        if(this.sprite2) {
            ctx.drawImage(Resources.get(this.sprite2), this.x, this.y);
        }
    }
};

// reset Exit 'class' constructor
// needed after ... .prototype = {...};
Exit.prototype.constructor = Exit;


// instantiate our classes
var player = new Player(),
    exit = new Exit(),
    allEnemies = [],
    gameover = false,
    highscore = 0,
    level = 1;

function initializeEnemies() {
    allEnemies = [];
    for (var i = 0; i < level; i++) {
        allEnemies.push(new Enemy());
    }
}

initializeEnemies();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
        player.handleInput(e);
});

