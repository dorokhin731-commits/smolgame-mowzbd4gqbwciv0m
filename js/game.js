// Initialize PixiJS
const app = new PIXI.Application({
    width: gameConfig.gameWidth,
    height: gameConfig.gameHeight,
    resolution: window.devicePixelRatio || 1,
    backgroundColor: gameConfig.backgroundColor,
});
document.body.appendChild(app.view);

let currentTetromino;
let grid;
let ui;
let inputHandler;
let particleSystem;

let score = 0;
let lines = 0;
let speed = 50;
let timer = 0;
let isGameOver = false;

function init() {
    grid = new Grid(gameConfig.gameWidth, gameConfig.gameHeight, gameConfig.blocksize);
    ui = new UI(app);
    particleSystem = new ParticleSystem(app);
    currentTetromino = getRandomTetromino();
    inputHandler = new InputHandler(app, moveTetrominoLeft, moveTetrominoRight, rotateTetromino);
    isGameOver = false;
    score = 0;
    lines = 0;
    speed = 50;
    timer = 0;
    ui.updateScore(score);
    ui.updateLines(lines);
    ui.hideGameOver();
}

function moveTetrominoLeft() {
    currentTetromino.moveLeft();
    if (checkCollision()) {
        currentTetromino.moveRight();
    }
}

function moveTetrominoRight() {
    currentTetromino.moveRight();
    if (checkCollision()) {
        currentTetromino.moveLeft();
    }
}

function rotateTetromino() {
    currentTetromino.rotate();
    if (checkCollision()) {
       //Attempt to nudge the tetromino back into bounds by shifting left and right
       currentTetromino.moveLeft();
       if(checkCollision()) {
          currentTetromino.moveRight();
          currentTetromino.moveRight();
           if(checkCollision()) {
              currentTetromino.moveLeft();
              currentTetromino.moveLeft();
              currentTetromino.rotate(); //Rotate Back
              currentTetromino.rotate();
              currentTetromino.rotate();
           }
       }
    }
}

function checkCollision() {
    for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
            if (currentTetromino.shape[y][x] === 1) {
                const gridX = Math.floor((currentTetromino.x + x * gameConfig.blocksize) / gameConfig.blocksize);
                const gridY = Math.floor((currentTetromino.y + y * gameConfig.blocksize) / gameConfig.blocksize);

                if (grid.isOccupied(gridX, gridY)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function moveTetrominoDown() {
    currentTetromino.moveDown();

    if (checkBottomCollision()) {
        placeTetromino();
        let linesCleared = grid.checkLines();
        if (linesCleared > 0) {
            lines += linesCleared;
            score += linesCleared * 100;
            speed = Math.max(5, speed - (linesCleared * 0.5));
            ui.updateScore(score);
            ui.updateLines(lines);
            shakeScreen(linesCleared * 2);

        }
        currentTetromino = getRandomTetromino();

        if (checkFutureCollision()) {
            gameOver();
        }
    }
}

function checkBottomCollision() {
    for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
            if (currentTetromino.shape[y][x] === 1) {
                const gridX = Math.floor((currentTetromino.x + x * gameConfig.blocksize) / gameConfig.blocksize);
                const gridY = Math.floor((currentTetromino.y + y * gameConfig.blocksize) / gameConfig.blocksize);

                if (gridY >= gameConfig.gameHeight / gameConfig.blocksize) {
                    return true;
                }
                if (grid.isOccupied(gridX, gridY))
                    return true;

            }
        }
    }
    return false;
}

function checkFutureCollision() {
    //Simulate one move down to check for collision
    currentTetromino.y += gameConfig.blocksize;
    let collision = checkBottomCollision();
    currentTetromino.y -= gameConfig.blocksize;
    return collision;

}
function placeTetromino() {
    const x = currentTetromino.x;
    const y = currentTetromino.y;
    const color = currentTetromino.color;
    grid.placeTetromino(currentTetromino);
    explode(x,y,color);

}

function gameOver() {
    isGameOver = true;
    ui.showGameOver();
}

function reset() {
    init();
}

function update(delta) {
    if (isGameOver) {
        return;
    }

    timer += delta;
    if (timer >= speed) {
        timer = 0;
        moveTetrominoDown();
    }

    app.stage.removeChildren(); // Clear the stage
    grid.draw(app);
    drawTetromino();
    // Keep UI on top
    app.stage.addChild(ui.scoreText);
    app.stage.addChild(ui.linesText);
    app.stage.addChild(ui.gameOverText);

    particleSystem.update(delta);


}

function drawTetromino() {
    for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
            if (currentTetromino.shape[y][x] === 1) {
                const block = new PIXI.Graphics();
                block.beginFill(currentTetromino.color);
                block.drawRect(currentTetromino.x + x * gameConfig.blocksize, currentTetromino.y + y * gameConfig.blocksize, gameConfig.blocksize, gameConfig.blocksize);
                block.endFill();
                app.stage.addChild(block);
            }
        }
    }
}

function shakeScreen(intensity) {
    const shake = intensity || 5;
    // Use a simple Tween to shake the stage
    new TWEEN.Tween(app.stage.position)
        .to({ x: Math.random() * shake - shake / 2, y: Math.random() * shake - shake / 2 }, 50)
        .repeat(3)
        .yoyo(true)
        .start()
        .onComplete(() => {
            app.stage.position.set(0, 0); // Reset position after shake
        });
}


function explode(x, y, color) {
    particleSystem.explode(x,y,color, 10);
}


// Main loop
app.ticker.add((delta) => {
    update(delta);
    TWEEN.update();
});

// Start game
init();