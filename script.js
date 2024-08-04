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
let aiDifficulty = 'easy';
let depthLimit = 5;

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

    makeMove(clickedCellIndex);

    if (gameMode === 'pvc' && currentPlayer === aiPlayer) {
        setTimeout(makeAiMove, 500);
    } else if (gameMode === 'cvc') {
        setTimeout(makeAiMove, 500);
    }
}

function makeMove(cellIndex) {
    gameState[cellIndex] = currentPlayer;
    const cell = document.querySelector(`[data-index="${cellIndex}"]`);
    cell.textContent = currentPlayer;
    cell.classList.add('pop-in');
    moves.push({ player: currentPlayer, position: cellIndex });
    updateMoveHistory();

    if (checkWinner()) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus(`Player ${currentPlayer}'s turn`);
    }
}

function checkWinner() {
    const winPatterns = getWinPatterns();
    for (let pattern of winPatterns) {
        if (pattern.every(index => gameState[index] === currentPlayer)) {
            highlightWinningCells(pattern);
            return true;
        }
    }
    return false;
}

function getWinPatterns() {
    const patterns = [];

    // Rows and Columns
    for (let i = 0; i < boardSize; i++) {
        patterns.push(Array.from({length: boardSize}, (_, j) => i * boardSize + j)); // Row
        patterns.push(Array.from({length: boardSize}, (_, j) => i + j * boardSize)); // Column
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

    let move;
    switch (aiDifficulty) {
        case 'easy':
            move = getRandomEmptyCell();
            break;
        case 'medium':
            move = Math.random() < 0.7 ? getSmartMove() : getRandomEmptyCell();
            break;
        case 'hard':
            move = getBestMove();
            break;
        case 'expert':
            move = getExpertMove();
            break;
    }

    if (move !== null) {
        setTimeout(() => makeMove(move), 500);
    }
}

function getRandomEmptyCell() {
    const emptyCells = gameState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getSmartMove() {
    // Check for winning move
    const winningMove = findWinningMove(currentPlayer);
    if (winningMove !== null) return winningMove;

    // Check for blocking opponent's winning move
    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    const blockingMove = findWinningMove(opponent);
    if (blockingMove !== null) return blockingMove;

    // If no winning or blocking move, choose a strategic position
    return getStrategicMove();
}

function findWinningMove(player) {
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = player;
            if (checkWinner()) {
                gameState[i] = '';
                return i;
            }
            gameState[i] = '';
        }
    }
    return null;
}

function getStrategicMove() {
    const corners = [0, boardSize - 1, boardSize * (boardSize - 1), boardSize * boardSize - 1];
    const availableCorners = corners.filter(corner => gameState[corner] === '');
    
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    const center = Math.floor(boardSize * boardSize / 2);
    if (gameState[center] === '') {
        return center;
    }

    return getRandomEmptyCell();
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = currentPlayer;
            let score = minimax(gameState, 0, false, -Infinity, Infinity);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
    if (checkWinner()) {
        return isMaximizing ? -10 + depth : 10 - depth;
    } else if (isDraw() || depth === depthLimit) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = currentPlayer;
                let score = minimax(board, depth + 1, false, alpha, beta);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break; // Alpha-beta pruning
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = currentPlayer === 'X' ? 'O' : 'X';
                let score = minimax(board, depth + 1, true, alpha, beta);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) break; // Alpha-beta pruning
            }
        }
        return bestScore;
    }
}

function getExpertMove() {
    // Implement opening book for common board sizes
    if (boardSize === 3 && moves.length === 0) {
        return getOptimalOpeningMove3x3();
    }

    // Use iterative deepening with time limit
    const timeLimit = 1000; // 1 second
    const startTime = Date.now();
    let bestMove;

    for (let depth = 1; depth <= boardSize * boardSize; depth++) {
        depthLimit = depth;
        const move = getBestMove();
        
        if (Date.now() - startTime > timeLimit) {
            break;
        }
        
        bestMove = move;
    }

    return bestMove;
}

function getOptimalOpeningMove3x3() {
    const corners = [0, 2, 6, 8];
    return corners[Math.floor(Math.random() * corners.length)];
}

function evaluateBoard() {
    let score = 0;
    const winPatterns = getWinPatterns();

    for (let pattern of winPatterns) {
        const line = pattern.map(index => gameState[index]);
        score += evaluateLine(line);
    }

    return score;
}

function evaluateLine(line) {
    const aiCount = line.filter(cell => cell === aiPlayer).length;
    const playerCount = line.filter(cell => cell !== aiPlayer && cell !== '').length;

    if (aiCount === boardSize) return 100;
    if (playerCount === boardSize) return -100;
    if (aiCount > 0 && playerCount > 0) return 0;
    return aiCount > playerCount ? aiCount : -playerCount;
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
difficultySelect.addEventListener('change', (e) => {
    aiDifficulty = e.target.value;
    resetGame();
});

// Initialize the game
initializeGame();