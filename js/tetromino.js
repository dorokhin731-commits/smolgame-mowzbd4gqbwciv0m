class Tetromino {
    constructor(id, shape, color) {
        this.id = id;
        this.shape = shape;
        this.color = color;
        this.x = gameConfig.gameWidth / 2 - (shape[0].length * gameConfig.blocksize) / 2;
        this.y = 0;
        this.rotation = 0;
    }

    moveLeft() {
        this.x -= gameConfig.blocksize;
    }

    moveRight() {
        this.x += gameConfig.blocksize;
    }

    rotate() {
        this.rotation += 1;
    }

    moveDown() {
        this.y += gameConfig.blocksize;
    }
}

const tetrominoes = [
    {
        id: 'I',
        shape: [
            [1, 1, 1, 1],
        ],
        color: 0x00ff00,
    },
    {
        id: 'J',
        shape: [
            [1, 0, 0],
            [1, 1, 1],
        ],
        color: 0x0000ff,
    },
    {
        id: 'L',
        shape: [
            [0, 0, 1],
            [1, 1, 1],
        ],
        color: 0xff0000,
    },
    {
        id: 'O',
        shape: [
            [1, 1],
            [1, 1],
        ],
        color: 0xffff00,
    },
    {
        id: 'S',
        shape: [
            [0, 1, 1],
            [1, 1, 0],
        ],
        color: 0x00ffff,
    },
    {
        id: 'T',
        shape: [
            [0, 1, 0],
            [1, 1, 1],
        ],
        color: 0xff00ff,
    },
    {
        id: 'Z',
        shape: [
            [1, 1, 0],
            [0, 1, 1],
        ],
        color: 0xff8000,
    },
];

function getRandomTetromino() {
    const randomIndex = Math.floor(Math.random() * tetrominoes.length);
    const data = tetrominoes[randomIndex];
    return new Tetromino(data.id, data.shape, data.color);
}