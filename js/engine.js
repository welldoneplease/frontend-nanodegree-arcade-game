/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    // once the game reaches 'gameover' state
    // we need to be able to reset and restart the game
    // this click handler does just that
    doc.addEventListener('click', function() {
        if (gameover) {
            gameover = false;
            reset();
            main();
        }
    }, false);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         * But ONLY if the gamestate isn't 'gameover'
         */
        if (!gameover) {
            win.requestAnimationFrame(main);
        }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        checkProgress();
    }

    /* This is called by the update function and loops through all of the
     * objects within allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for the
     * player object.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }


    /* This is called every tick to ensure that the game ends when the player
     * is hit by one of the enemies.
     */
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            // bounding box hit detection snippet (sans spatial partitioning madness):
            // http://blog.sklambert.com/html5-canvas-game-2d-collision-detection
            if (enemy.x < player.x + 50 && enemy.x + 65 > player.x &&
                enemy.y < player.y + 20 && enemy.y + 20 > player.y) {
                gameover = true;
                if (highscore < level) {
                    highscore = level;
                }
            }
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * their render function.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        exit.render();
        player.render();

        displayOnscreenText({
            fillStyle: "white",
            font: "15px Arial",
            fillText: {
                text: "Level: "+level,
                x: 5,
                y: 562
            },
            strokeText: false
        },{
            fillStyle: "white",
            font: "15px Arial",
            fillText: {
                text: "HighScore: "+highscore,
                x: 5,
                y: 580
            },
            strokeText: false
        });

        if(gameover) {
            displayOnscreenText({
                fillStyle: "white",
                strokeStyle: "black",
                lineWidth: 1,
                font: "56px Arial",
                fillText: {
                    text: "You are dead!",
                    x: 80,
                    y: 270
                },
                strokeText: true
            },{
                font: "30px Arial",
                fillText: {
                    text: "Click anywhere to restart",
                    x: 90,
                    y: 350
                },
                strokeText: true
            });
        }
    }

    /* This function handles game resets.
     * It resets the level counter, player and exit entities
     * and reinitializes the enemies array.
     */
    function reset() {
        level = 1;
        initializeEnemies();
        exit.reset();
        player.reset();
    }

    /* This function checks if the player did get the key and should progress
     * to the next higher level - resets all game entities and increments level
     */
    function checkProgress() {
        if (player.key) {
            player.key = false;
            player.enableInput = false;
            allEnemies.forEach(function(enemy) {
                enemy.slowMo();
            });
            setTimeout(function() {
                level += 1;
                allEnemies.forEach(function(enemy) {
                    enemy.reset();
                });
                exit.reset();
                initializeEnemies();
                player.reset();
            }, 1000);
        }
    }

    /* Helper function to render text on screen
     * takes as a param multiple texxt config objects
     * and loops through them.
     */
    function displayOnscreenText() {
        for(var config in arguments) {
            var c = arguments[config] || {};

            ctx.fillStyle = c.fillStyle;
            ctx.strokeStyle = c.strokeStyle;
            ctx.lineWidth = c.lineWidth;
            ctx.font = c.font;
            ctx.fillText(c.fillText.text, c.fillText.x, c.fillText.y);

            if (c.strokeText) {
                ctx.strokeText(c.fillText.text, c.fillText.x, c.fillText.y);
            }
        }
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/Rock.png',
        'images/Key.png',
        'images/enemy-bug.png',
        'images/char-cat-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
