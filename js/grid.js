class Grid {
    constructor(width, height, blocksize) {
        this.width = width;
        this.height = height;
        this.blocksize = blocksize;
        this.grid = [];
        this.init();
    }

    init() {
        this.grid = [];
        for (let y = 0; y < this.height / this.blocksize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width / this.blocksize; x++) {
                this.grid[y][x] = 0;
            }
        }
    }

    isOccupied(x, y) {
        if (x < 0 || x >= this.width / this.blocksize || y >= this.height / this.blocksize) {
            return true;
        }
        if (y < 0) return false;  //ignore checks above the grid
        return this.grid[y][x] === 1;
    }

    placeTetromino(tetromino) {
        for (let y = 0; y < tetromino.shape.length; y++) {
            for (let x = 0; x < tetromino.shape[y].length; x++) {
                if (tetromino.shape[y][x] === 1) {
                    const gridX = Math.floor((tetromino.x + x * this.blocksize) / this.blocksize);
                    const gridY = Math.floor((tetromino.y + y * this.blocksize) / this.blocksize);

                    if (gridY < 0) continue; //ignore out of bounds exception when starting
                    this.grid[gridY][gridX] = 1;
                }
            }
        }
    }

    checkLines() {
        let linesCleared = 0;
        for (let y = this.grid.length - 1; y >= 0; y--) {
            let isFullLine = true;

            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === 0) {
                    isFullLine = false;
                    break;
                }
            }

            if (isFullLine) {
                linesCleared++;
                this.grid.splice(y, 1);
                this.grid.unshift(Array(this.width / this.blocksize).fill(0));
                y++; // Re-check the new line at this index
            }
        }
        return linesCleared;
    }

    draw(app) {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === 1) {
                    const block = new PIXI.Graphics();
                    block.beginFill(0xffffff);
                    block.drawRect(x * this.blocksize, y * this.blocksize, this.blocksize, this.blocksize);
                    block.endFill();
                    app.stage.addChild(block);
                }
            }
        }
    }
}