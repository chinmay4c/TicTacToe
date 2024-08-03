const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const themeToggle = document.getElementById('theme-toggle');
const gameModeSelect = document.getElementById('game-mode');
const difficultySelect = document.getElementById('difficulty');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const timerDisplay = document.getElementById('timer');
const winAnimation = document.getElementById('win-animation');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scores = { X: 0, O: 0 };
let aiPlayer = 'O';
let gameMode = 'pvp';
let timer;
let seconds = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add('pop-in');

    checkResult();

    if (gameActive && gameMode === 'pvc' && currentPlayer !== aiPlayer) {
        currentPlayer = aiPlayer;
        setTimeout(makeAiMove, 500);
    } else if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            cells[a].classList.add('winning');
            cells[b].classList.add('winning');
            cells[c].classList.add('winning');
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

function resetGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    status.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('pop-in', 'winning');
    });
    resetTimer();
    startTimer();
}

function updateScoreDisplay() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function makeAiMove() {
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
        gameState[move] = aiPlayer;
        cells[move].textContent = aiPlayer;
        cells[move].classList.add('pop-in');
        checkResult();
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (gameActive) {
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function getRandomEmptyCell() {
    const emptyCells = gameState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = aiPlayer;
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -1,
        O: 1,
        draw: 0
    };

    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = aiPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = aiPlayer === 'O' ? 'X' : 'O';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a];
        }
    }
    if (!gameState.includes('')) return 'draw';
    return null;
}

function updateGameMode() {
    gameMode = gameModeSelect.value;
    difficultySelect.style.display = gameMode === 'pvc' ? 'inline-block' : 'none';
    resetGame();
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showWinAnimation() {
    createConfetti();
    setTimeout(() => {
        winAnimation.innerHTML = '';
    }, 3000);
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        winAnimation.appendChild(confetti);
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
themeToggle.addEventListener('click', toggleTheme);
gameModeSelect.addEventListener('change', updateGameMode);

// Initialize the game
updateGameMode();
startTimer();