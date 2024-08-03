:root {
    --bg-color: #f0f0f0;
    --text-color: #333;
    --cell-bg: #fff;
    --cell-border: #3498db;
    --hover-bg: #e3f2fd;
    --button-bg: #2ecc71;
    --button-text: #fff;
    --winning-bg: #a7e9af;
    --header-bg: #3498db;
    --container-bg: #ecf0f1;
}

body {
    font-family: 'Roboto', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

.game-container {
    text-align: center;
    max-width: 600px;
    width: 100%;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    background-color: var(--container-bg);
}

h1 {
    margin-bottom: 30px;
    color: var(--header-bg);
    font-size: 2.5em;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.controls {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;
}

.board {
    display: grid;
    grid-gap: 15px;
    margin-bottom: 30px;
    justify-content: center;
    padding: 20px;
    background-color: var(--cell-border);
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.cell {
    aspect-ratio: 1;
    background-color: var(--cell-bg);
    border: 3px solid var(--cell-border);
    font-size: 2.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cell:hover {
    background-color: var(--hover-bg);
    transform: scale(1.05);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.cell.winning {
    background-color: var(--winning-bg);
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

#status {
    font-size: 1.4em;
    margin-bottom: 20px;
    font-weight: bold;
    color: var(--header-bg);
}

.score {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;
    font-size: 1.2em;
    background-color: var(--cell-bg);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button, select {
    font-size: 1em;
    padding: 12px 24px;
    cursor: pointer;
    background-color: var(--button-bg);
    color: var(--button-text);
    border: none;
    border-radius: 25px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button:hover, select:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.dark-mode {
    --bg-color: #2c3e50;
    --text-color: #ecf0f1;
    --cell-bg: #34495e;
    --cell-border: #3498db;
    --hover-bg: #2980b9;
    --button-bg: #27ae60;
    --winning-bg: #27ae60;
    --header-bg: #3498db;
    --container-bg: #34495e;
}

@media (max-width: 480px) {
    .game-container {
        padding: 20px;
    }

    .cell {
        font-size: 2em;
    }

    .controls {
        flex-direction: column;
    }
}

.pop-in {
    animation: pop-in 0.3s ease-out;
}

@keyframes pop-in {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

.confetti {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
}

#timer {
    margin-top: 20px;
    font-size: 1.2em;
    font-weight: bold;
    color: var(--header-bg);
}

#move-history {
    margin-top: 30px;
    max-height: 200px;
    overflow-y: auto;
    border: 2px solid var(--cell-border);
    padding: 15px;
    text-align: left;
    border-radius: 10px;
    background-color: var(--cell-bg);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

#move-history::-webkit-scrollbar {
    width: 8px;
}

#move-history::-webkit-scrollbar-track {
    background: var(--cell-bg);
}

#move-history::-webkit-scrollbar-thumb {
    background-color: var(--cell-border);
    border-radius: 4px;
}

.confetti-piece {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #ffd300;
    top: -10px;
    opacity: 0;
}

@keyframes confetti-fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

.confetti-piece {
    animation: confetti-fall 3s linear infinite;
}