// Get canvas and context for the main game and next piece display
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextContext = nextCanvas.getContext('2d');

// Get UI elements
const gameOverModal = document.getElementById('gameOverModal');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const newGameButton = document.getElementById('newGameButton');
const scoreElement = document.getElementById('score');
const muteButton = document.getElementById('muteButton');
const levelElement = document.getElementById('level');

// Add event listeners for buttons
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause);
restartButton.addEventListener('click', restartGame);
newGameButton.addEventListener('click', startNewGame);
muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    backgroundMusic.muted = isMuted;
    gameOverSound.muted = isMuted;
    lineClearSound.muted = isMuted;
    muteButton.textContent = isMuted ? '🔊' : '🔇';
});

// Additional mute button functionality
document.getElementById('muteButton').addEventListener('click', function() {
    const icon = this.querySelector('.sound-icon');
    if (icon.textContent === '🔇') {
        icon.textContent = '🔊';
    } else {
        icon.textContent = '🔇';
    }
});

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', (event) => {
    // Get the modals
    var infoModal = document.getElementById("infoModal");
    var controlsModal = document.getElementById("controlsModal");

    // Get the <span> elements that close the modals
    var closeIcons = document.getElementsByClassName("close");

    // When the user clicks on <span> (x), close the modal
    for (var i = 0; i < closeIcons.length; i++) {
        closeIcons[i].onclick = function() {
            this.parentElement.parentElement.style.display = "none";
        }
    }

    var controlsButton = document.getElementById("controllsButton");

    // When the user clicks on the controls button, toggle the controls modal
    controlsButton.onclick = function() {
        if (controlsModal.style.display === "none" || controlsModal.style.display === "") {
            controlsModal.style.display = "block";
        } else {
            controlsModal.style.display = "none";
        }
    }
});

// Event listeners for info and controls modals
document.getElementById('infoButton').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'block';
});

document.getElementById('closeInfoButton').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', (event) => {
    const controlsButton = document.getElementById('controllsButton');
    const controlsModal = document.getElementById('controllsModal');
    const closeControlsButton = document.getElementById('closeControllsButton');

    controlsButton.addEventListener('click', () => {
        controlsModal.style.display = 'block';
    });

    closeControlsButton.addEventListener('click', () => {
        controlsModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == controlsModal) {
            controlsModal.style.display = 'none';
        }
    });
});

// Game state variables
let gameInterval = null;
let isPaused = false;
let isGameOver = false;
let isMuted = false;
let level = 1;
let linesCleared = 0;

// Game constants
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 20;
const BORDER_COLOR = 'white';
const EMPTY_COLOR = 'black';

// Tetromino shapes and colors
const TETROMINOES = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
};

const COLORS = {
    I: 'cyan',
    O: 'yellow',
    T: 'purple',
    J: 'blue',
    L: 'orange',
    S: 'green',
    Z: 'red',
};

// Game board and piece variables
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let score = 0;
let currentPiece = null;
let nextPieces = [];
let currentX = 3;
let currentY = 0;
let ghostY = 0;

// Event listener for key presses
document.addEventListener('keydown', handleKeyPress);

// Load audio files
const backgroundMusic = new Audio('audio/TetrisThemeMusic.ogg');
const gameOverSound = new Audio('audio/gameover.wav');
const lineClearSound = new Audio('audio/clear.wav');

// Set loop for background music
backgroundMusic.loop = true;

// Countdown function before starting the game
function countdown(callback) {
    let count = 3;
    const countdownInterval = setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = '128px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(count, canvas.width / 2, canvas.height / 2);
        count--;

        if (count < 0) {
            clearInterval(countdownInterval);
            callback();
        }
    }, 1000);
}

// Start the game
function startGame() {
    if (gameInterval || isGameOver) return;

    console.log('Starting game...');
    backgroundMusic.play();
    countdown(() => {
        spawnPiece();
        draw();
        gameInterval = setInterval(gameLoop, getGameSpeed());
        startButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';
    });
}

// Toggle pause state
function togglePause() {
    if (isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

// Pause the game
function pauseGame() {
    clearInterval(gameInterval);
    gameInterval = null;
    isPaused = true;
    pauseButton.textContent = 'CONTINUE';
    console.log('Game paused');
}

// Resume the game
function resumeGame() {
    gameInterval = setInterval(gameLoop, getGameSpeed());
    isPaused = false;
    pauseButton.textContent = 'PAUSE';
    console.log('Game resumed');
}

// Restart the game
function restartGame() {
    console.log('Restarting game...');
    clearInterval(gameInterval);
    gameInterval = null;
    score = 0;
    level = 1; // Reset level to 1
    linesCleared = 0;
    scoreElement.textContent = score;
    levelElement.textContent = level; // Update the level display
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPiece = null;
    nextPieces = [];
    currentX = 3;
    currentY = 0;
    isPaused = false;
    isGameOver = false;
    pauseButton.textContent = 'PAUSE';
    gameOverModal.style.display = 'none';
    startGame();
}

// Start a new game
function startNewGame() {
    console.log('Starting new game...');
    gameOverModal.style.display = 'none';
    nextPieces = [];
    restartGame();
}

// Main game loop
function gameLoop() {
    if (isGameOver) return;

    move(0, 1);
    draw();
}

// Spawn a new piece
function spawnPiece() {
    if (isGameOver) return;

    if (nextPieces.length === 0) {
        generateNextPieces();
    }

    currentPiece = nextPieces.shift();
    nextPieces.push(randomTetromino());

    currentX = 3;
    currentY = 0;

    if (!isValidMove(currentX, currentY, currentPiece.shape)) {
        isGameOver = true;
        showGameOverModal();
        clearInterval(gameInterval);
        return;
    }

    calculateGhostPosition();
    drawNextPieces();
}

// Generate next pieces
function generateNextPieces() {
    for (let i = 0; i < 6; i++) {
        nextPieces.push(randomTetromino());
    }
}

// Move the current piece
function move(deltaX, deltaY) {
    if (isGameOver) return false;

    const newX = currentX + deltaX;
    const newY = currentY + deltaY;

    if (isValidMove(newX, newY, currentPiece.shape)) {
        currentX = newX;
        currentY = newY;
        calculateGhostPosition();
        return true;
    } else if (deltaY > 0) {
        placePiece();
        return false;
    }
    return false;
}

// Rotate the current piece
function rotatePiece() {
    const rotatedShape = currentPiece.shape[0].map((_, colIndex) =>
        currentPiece.shape.map((row) => row[colIndex])
    ).reverse();

    if (isValidMove(currentX, currentY, rotatedShape)) {
        currentPiece.shape = rotatedShape;
        calculateGhostPosition();
    }
}

// Place the current piece on the board
function placePiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentY + y][currentX + x] = currentPiece.color;
            }
        });
    });

    clearLines();
    if (!isGameOver) {
        spawnPiece();
    }
}

// Initialize the game board
function initializeBoard() {
    const gameBoardElement = document.getElementById('gameBoard');
    gameBoardElement.innerHTML = '';

    for (let row = 0; row < ROWS; row++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');

        for (let col = 0; col < COLS; col++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            rowElement.appendChild(cellElement);
        }

        gameBoardElement.appendChild(rowElement);
    }
}

initializeBoard();

// Check if a move is valid
function isValidMove(x, y, shape) {
    return shape.every((row, dy) => {
        return row.every((value, dx) => {
            let newX = x + dx;
            let newY = y + dy;
            return (
                value === 0 ||
                (newX >= 0 &&
                    newX < COLS &&
                    newY < ROWS &&
                    board[newY][newX] === null)
            );
        });
    });
}

// Clear completed lines
function clearLines() {
    let linesClearedThisTurn = 0;

    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every((cell) => cell)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(null));
            linesClearedThisTurn++;
            row++; // Check the same row again after shifting down
        }
    }

    if (linesClearedThisTurn > 0) {
        lineClearSound.play();
        updateScore(linesClearedThisTurn);
    }
}

// Draw the game board and pieces
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = board[row][col];
            drawBlock(col, row, cell || EMPTY_COLOR);
        }
    }

    // Draw ghost piece
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(currentX + x, ghostY + y, 'rgba(255, 255, 255, 0.3)');
            }
        });
    });

    // Draw current piece
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(currentX + x, currentY + y, currentPiece.color);
            }
        });
    });
}

// Draw a single block
function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeStyle = BORDER_COLOR;
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Draw the next pieces
function drawNextPieces() {
    if (isGameOver) return;

    nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    nextPieces.forEach((piece, index) => {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    drawNextBlock(x, y + index * 5, piece.color);
                }
            });
        });
    });
}

// Draw a single block in the next pieces display
function drawNextBlock(x, y, color) {
    nextContext.fillStyle = color;
    nextContext.fillRect(x * NEXT_BLOCK_SIZE, y * NEXT_BLOCK_SIZE, NEXT_BLOCK_SIZE, NEXT_BLOCK_SIZE);
    nextContext.strokeStyle = BORDER_COLOR;
    nextContext.strokeRect(x * NEXT_BLOCK_SIZE, y * NEXT_BLOCK_SIZE, NEXT_BLOCK_SIZE, NEXT_BLOCK_SIZE);
}

// Show the game over modal
function showGameOverModal() {
    gameOverSound.play();
    gameOverModal.style.display = 'flex';
}

// Update the score
function updateScore(linesClearedThisTurn) {
    const points = [0, 100, 300, 500, 800];
    score += points[linesClearedThisTurn];
    linesCleared += linesClearedThisTurn;
    scoreElement.textContent = score;

    // Increase level for every 10 lines cleared
    if (linesCleared >= level * 10) {
        level++;
        levelElement.textContent = level; // Update the level display
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, getGameSpeed());
    }
}

// Get the game speed based on the current level
function getGameSpeed() {
    return 500 - (level - 1) * 50;
}

// Generate a random tetromino
function randomTetromino() {
    const pieces = Object.keys(TETROMINOES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
        shape: TETROMINOES[randomPiece],
        color: COLORS[randomPiece],
    };
}

// Handle key presses for game controls
function handleKeyPress(event) {
    if (isPaused || isGameOver) return;

    switch (event.key) {
        case 'ArrowLeft':
            move(-1, 0);
            break;
        case 'ArrowRight':
            move(1, 0);
            break;
        case 'ArrowDown':
            move(0, 1);
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
        case ' ':
            while (move(0, 1)) {}
            break;
    }
    draw();
}

// Calculate the ghost piece position
function calculateGhostPosition() {
    ghostY = currentY;
    while (isValidMove(currentX, ghostY + 1, currentPiece.shape)) {
        ghostY++;
    }
}