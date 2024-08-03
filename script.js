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
let gameActive = false;
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
    updateGameModeUI();
}

function handleCellClick(event) {
    if (!gameActive) return;

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

    if (checkWinner()) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus(`Player ${currentPlayer}'s turn`);

        if (gameMode === 'pvc' && currentPlayer === aiPlayer) {
            setTimeout(makeAiMove, 500);
        } else if (gameMode === 'cvc') {
            setTimeout(makeAiMove, 500);
        }
    }
}

function checkWinner() {
    const winPatterns = getWinPatterns();
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            highlightWinningCells(pattern);
            return true;
        }
    }
    return false;
}

function getWinPatterns() {
    const patterns = [];

    // Rows
    for (let i = 0; i < boardSize; i++) {
        patterns.push(Array.from({length: boardSize}, (_, j) => i * boardSize + j));
    }

    // Columns
    for (let i = 0; i < boardSize; i++) {
        patterns.push(Array.from({length: boardSize}, (_, j) => i + j * boardSize));
    }

    // Diagonals
    patterns.push(Array.from({length: boardSize}, (_, i) => i * (boardSize + 1)));
    patterns.push(Array.from({length: boardSize}, (_, i) => (i + 1) * (boardSize - 1)));

    return patterns;
}

function isDraw() {
    return gameState.every(cell => cell !== '');
}

function endGame(isDraw) {
    gameActive = false;
    if (isDraw) {
        updateStatus("It's a draw!");
    } else {
        updateStatus(`Player ${currentPlayer} wins!`);
        scores[currentPlayer]++;
        updateScoreDisplay();
        showWinAnimation();
    }
    stopTimer();
}

function updateStatus(message) {
    status.textContent = message;
    status.classList.add('change');
    setTimeout(() => status.classList.remove('change'), 300);
}

function highlightWinningCells(pattern) {
    pattern.forEach(index => {
        document.querySelector(`[data-index="${index}"]`).classList.add('winning');
    });
}

function resetGame() {
    gameState = Array(boardSize * boardSize).fill('');
    currentPlayer = 'X';
    gameActive = true;
    moves = [];
    updateStatus(`Player ${currentPlayer}'s turn`);
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
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
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
        setTimeout(() => {
            const cell = document.querySelector(`[data-index="${move}"]`);
            cell.click();
        }, 500);
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

    for (let i = 0; i < gameState.length; i++) {
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
    if (checkWinner()) {
        return isMaximizing ? -10 + depth : 10 - depth;
    } else if (isDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
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
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = aiPlayer === 'X' ? 'O' : 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function startTimer() {
    seconds = 0;
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

function updateMoveHistory() {
    moveHistory.innerHTML = moves.map((move, index) => 
        `<div>Move ${index + 1}: Player ${move.player} - Position ${move.position}</div>`
    ).join('');
    moveHistory.scrollTop = moveHistory.scrollHeight;
}

function showWinAnimation() {
    winAnimation.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        createConfettiPiece();
    }
}

function createConfettiPiece() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti-piece');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.backgroundColor = getRandomColor();
    winAnimation.appendChild(confetti);
}

function getRandomColor() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function updateGameModeUI() {
    difficultySelect.style.display = gameMode === 'pvp' ? 'none' : 'inline-block';
    if (gameMode === 'cvc') {
        aiPlayer = 'X';
    } else {
        aiPlayer = 'O';
    }
}

// Event Listeners
resetButton.addEventListener('click', resetGame);
themeToggle.addEventListener('click', toggleTheme);
gameModeSelect.addEventListener('change', () => {
    gameMode = gameModeSelect.value;
    updateGameModeUI();
    resetGame();
});
boardSizeSelect.addEventListener('change', initializeGame);
difficultySelect.addEventListener('change', resetGame);

// Initialize the game
initializeGame();