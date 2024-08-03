const board = document.getElementById('board');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const themeToggle = document.getElementById('theme-toggle');
const gameModeSelect = document.getElementById('game-mode');
const difficultySelect = document.getElementById('difficulty');
const boardSizeSelect = document.getElementById('board-size');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const timerDisplay = document.getElementById('timer');
const winAnimation = document.getElementById('win-animation');
const moveHistory = document.getElementById('move-history');

let currentPlayer = 'X';
let gameState;
let gameActive = true;
let scores = { X: 0, O: 0 };
let aiPlayer = 'O';
let gameMode = 'pvp';
let boardSize = 3;
let timer;
let seconds = 0;
let moves = [];

function initializeGame() {
    boardSize = parseInt(boardSizeSelect.value);
    gameState = Array(boardSize * boardSize).fill('');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }

    resetGame();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add('pop-in');
    moves.push({ player: currentPlayer, position: clickedCellIndex });
    updateMoveHistory();

    checkResult();

    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;

        if (gameMode === 'pvc' && currentPlayer === aiPlayer) {
            setTimeout(makeAiMove, 500);
        } else if (gameMode === 'cvc') {
            setTimeout(makeAiMove, 500);
        }
    }
}

function checkResult() {
    const winningConditions = getWinningConditions();
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        if (a === '') continue;

        let win = true;
        for (let j = 1; j < winCondition.length; j++) {
            if (gameState[winCondition[j]] !== a) {
                win = false;
                break;
            }
        }

        if (win) {
            roundWon = true;
            winCondition.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('winning');
            });
            break;
        }
    }

    if (roundWon) {
        status.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        scores[currentPlayer]++;
        updateScoreDisplay();
        showWinAnimation();
        stopTimer();
        return;
    }

    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        status.textContent = "It's a draw!";
        gameActive = false;
        stopTimer();
        return;
    }
}

function getWinningConditions() {
    const winningConditions = [];

    // Rows
    for (let i = 0; i < boardSize; i++) {
        winningConditions.push(Array.from({length: boardSize}, (_, j) => i * boardSize + j));
    }

    // Columns
    for (let i = 0; i < boardSize; i++) {
        winningConditions.push(Array.from({length: boardSize}, (_, j) => i + j * boardSize));
    }

    // Diagonals
    winningConditions.push(Array.from({length: boardSize}, (_, i) => i * (boardSize + 1)));
    winningConditions.push(Array.from({length: boardSize}, (_, i) => (i + 1) * (boardSize - 1)));

    return winningConditions;
}

function resetGame() {
    currentPlayer = 'X';
    gameState = Array(boardSize * boardSize).fill('');
    gameActive = true;
    moves = [];
    status.textContent = `Player ${currentPlayer}'s turn`;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('pop-in', 'winning');
    });
    resetTimer();
    startTimer();
    updateMoveHistory();

    if (gameMode === 'cvc') {
        makeAiMove();
    }
}

function updateScoreDisplay() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function makeAiMove() {
    if (!gameActive) return;

    const difficulty = difficultySelect.value;
    let move;

    switch (difficulty) {
        case 'easy':
            move = getRandomEmptyCell();
            break;
        case 'medium':
            move = Math.random() < 0.5 ? getBestMove() : getRandomEmptyCell();
            break;
        case 'hard':
            move = getBestMove();
            break;
    }

    if (move !== null) {
        const cell = document.querySelector(`[data-index="${move}"]`);
        cell.click();
    }
}

function getRandomEmptyCell() {
    const emptyCells = gameState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}