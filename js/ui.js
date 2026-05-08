class UI {
    constructor(app) {
        this.app = app;
        this.score = 0;
        this.lines = 0;
        this.scoreText = new PIXI.Text('Score: 0', this.getTextSyle());
        this.scoreText.x = 10;
        this.scoreText.y = 10;
        this.linesText = new PIXI.Text('Lines: 0', this.getTextSyle());
        this.linesText.x = 10;
        this.linesText.y = 40;
        this.gameOverText = new PIXI.Text('Game Over', this.getTextSyle());
        this.gameOverText.x = gameConfig.gameWidth / 2 - this.gameOverText.width / 2;
        this.gameOverText.y = gameConfig.gameHeight / 2 - this.gameOverText.height / 2;
        this.gameOverText.visible = false;
        this.app.stage.addChild(this.scoreText);
        this.app.stage.addChild(this.linesText);
        this.app.stage.addChild(this.gameOverText);
    }

    updateScore(score) {
        this.score = score;
        this.scoreText.text = 'Score: ' + this.score;
    }

    updateLines(lines) {
        this.lines = lines;
        this.linesText.text = 'Lines: ' + this.lines;
    }

    showGameOver() {
        this.gameOverText.visible = true;
    }

    hideGameOver() {
        this.gameOverText.visible = false;
    }

    getTextSyle() {
        return {
            fontSize: 24,
            fontFamily: gameConfig.fontFamily,
            fill: gameConfig.fontColor,
        }
    }
}