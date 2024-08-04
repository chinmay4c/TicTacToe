import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TicTacToe {

    private static char[][] board;
    private static int boardSize;
    private static char currentPlayer;
    private static int playerXWins = 0;
    private static int playerOWins = 0;
    private static int draws = 0;
    private static int totalGames = 0;
    private static Scanner scanner = new Scanner(System.in);
    private static Random random = new Random();
    private static List<String> gameHistory = new ArrayList<>();
    private static boolean isComputerPlayer = false;
    private static int difficultyLevel = 1;
    private static final String[] DIFFICULTY_NAMES = {"Easy", "Medium", "Hard", "Expert"};
    private static final int MAX_DIFFICULTY = 4;
    private static final int MIN_BOARD_SIZE = 3;
    private static final int MAX_BOARD_SIZE = 20;
    private static final String GAME_LOG_FILE = "tictactoe_log.txt";
    private static final DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

    public static void main(String[] args) {
        System.out.println("Welcome to Enhanced Tic-Tac-Toe!");
        
        while (true) {
            mainMenu();
            if (!playAgain()) {
                saveGameHistory();
                System.out.println("Thank you for playing Enhanced Tic-Tac-Toe!");
                break;
            }
        }
    }

    private static void mainMenu() {
        System.out.println("\nMain Menu:");
        System.out.println("1. Play against a friend");
        System.out.println("2. Play against the computer");
        System.out.println("3. View game history");
        System.out.println("4. Change board size");
        System.out.println("5. Set difficulty level");
        System.out.println("6. View statistics");
        System.out.println("7. Help");
        System.out.println("8. Exit");

        int choice = getValidInput("Enter your choice (1-8): ", 1, 8);

        switch (choice) {
            case 1:
                isComputerPlayer = false;
                playGame();
                break;
            case 2:
                isComputerPlayer = true;
                playGame();
                break;
            case 3:
                viewGameHistory();
                break;
            case 4:
                changeBoardSize();
                break;
            case 5:
                setDifficultyLevel();
                break;
            case 6:
                viewStatistics();
                break;
            case 7:
                showHelp();
                break;
            case 8:
                saveGameHistory();
                System.out.println("Thank you for playing Enhanced Tic-Tac-Toe!");
                System.exit(0);
        }
    }

    private static void playGame() {
        initializeBoard();
        currentPlayer = 'X';
        printBoard();
        
        while (true) {
            if (currentPlayer == 'X' || !isComputerPlayer) {
                playerMove();
            } else {
                computerMove();
            }
            printBoard();
            if (isWinner()) {
                System.out.println("Player " + currentPlayer + " wins!");
                updateScore(currentPlayer);
                printScore();
                String result = "Player " + currentPlayer + " won!";
                gameHistory.add(result);
                logGame(result);
                break;
            }
            if (isBoardFull()) {
                System.out.println("The game is a draw!");
                draws++;
                printScore();
                String result = "The game is a draw.";
                gameHistory.add(result);
                logGame(result);
                break;
            }
            switchPlayer();
        }
        totalGames++;
    }

    private static void initializeBoard() {
        board = new char[boardSize][boardSize];
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                board[i][j] = '-';
            }
        }
    }

    private static void printBoard() {
        System.out.println("\nCurrent board:");
        System.out.print("   ");
        for (int i = 0; i < boardSize; i++) {
            System.out.printf("%2d ", i);
        }
        System.out.println();

        for (int i = 0; i < boardSize; i++) {
            System.out.printf("%2d ", i);
            for (int j = 0; j < boardSize; j++) {
                System.out.printf("%2c ", board[i][j]);
            }
            System.out.println();
        }
        System.out.println();
    }

    private static void playerMove() {
        int row, col;
        while (true) {
            System.out.println("Player " + currentPlayer + ", enter your move:");
            row = getValidInput("Row", 0, boardSize - 1);
            col = getValidInput("Column", 0, boardSize - 1);
            if (isValidMove(row, col)) {
                board[row][col] = currentPlayer;
                break;
            } else {
                System.out.println("Invalid move. The cell is already occupied.");
            }
        }
    }

    private static void computerMove() {
        System.out.println("Computer's turn (Player O):");
        int[] move = getBestMove();
        int row = move[0];
        int col = move[1];
        board[row][col] = currentPlayer;
        System.out.println("Computer placed O at row " + row + ", column " + col);
    }

    private static int[] getBestMove() {
        if (random.nextInt(100) < getDifficultyPercentage()) {
            return minimax(board, currentPlayer, 0);
        } else {
            return getRandomMove();
        }
    }

    private static int getDifficultyPercentage() {
        switch (difficultyLevel) {
            case 1: return 25;
            case 2: return 50;
            case 3: return 75;
            case 4: return 100;
            default: return 50;
        }
    }

    private static int[] getRandomMove() {
        List<int[]> availableMoves = getAvailableMoves();
        return availableMoves.get(random.nextInt(availableMoves.size()));
    }

    private static List<int[]> getAvailableMoves() {
        List<int[]> moves = new ArrayList<>();
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                if (board[i][j] == '-') {
                    moves.add(new int[]{i, j});
                }
            }
        }
        return moves;
    }

    private static int[] minimax(char[][] board, char player, int depth) {
        List<int[]> availableMoves = getAvailableMoves();
        int bestScore = (player == 'O') ? Integer.MIN_VALUE : Integer.MAX_VALUE;
        int[] bestMove = null;

        if (availableMoves.isEmpty() || isGameOver() || depth >= 5) {
            bestScore = evaluateBoard();
        } else {
            for (int[] move : availableMoves) {
                board[move[0]][move[1]] = player;
                int score;

                if (player == 'O') {
                    score = minimax(board, 'X', depth + 1)[2];
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = move;
                    }
                } else {
                    score = minimax(board, 'O', depth + 1)[2];
                    if (score < bestScore) {
                        bestScore = score;
                        bestMove = move;
                    }
                }
                board[move[0]][move[1]] = '-';
            }
        }

        return (bestMove != null) ? new int[]{bestMove[0], bestMove[1], bestScore} : new int[]{-1, -1, bestScore};
    }

    private static boolean isGameOver() {
        return isWinner() || isBoardFull();
    }

    private static int evaluateBoard() {
        int score = 0;

        // Check rows and columns
        for (int i = 0; i < boardSize; i++) {
            score += evaluateLine(board[i]);
            score += evaluateLine(getColumn(i));
        }

        // Check diagonals
        score += evaluateLine(getDiagonal());
        score += evaluateLine(getAntiDiagonal());

        return score;
    }

    private static int evaluateLine(char[] line) {
        int score = 0;
        int xCount = 0;
        int oCount = 0;

        for (char c : line) {
            if (c == 'X') xCount++;
            else if (c == 'O') oCount++;
        }

        if (xCount == 0 && oCount > 0) score -= Math.pow(10, oCount - 1);
        else if (oCount == 0 && xCount > 0) score += Math.pow(10, xCount - 1);

        return score;
    }

    private static char[] getColumn(int col) {
        char[] column = new char[boardSize];
        for (int i = 0; i < boardSize; i++) {
            column[i] = board[i][col];
        }
        return column;
    }

    private static char[] getDiagonal() {
        char[] diagonal = new char[boardSize];
        for (int i = 0; i < boardSize; i++) {
            diagonal[i] = board[i][i];
        }
        return diagonal;
    }

    private static char[] getAntiDiagonal() {
        char[] antiDiagonal = new char[boardSize];
        for (int i = 0; i < boardSize; i++) {
            antiDiagonal[i] = board[i][boardSize - 1 - i];
        }
        return antiDiagonal;
    }

    private static void switchPlayer() {
        currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
    }

    private static boolean isWinner() {
        // Check rows and columns
        for (int i = 0; i < boardSize; i++) {
            if (checkLine(board[i]) || checkLine(getColumn(i))) {
                return true;
            }
        }
        // Check diagonals
        return checkLine(getDiagonal()) || checkLine(getAntiDiagonal());
    }

    private static boolean checkLine(char[] line) {
        char first = line[0];
        if (first == '-') return false;
        for (int i = 1; i < boardSize; i++) {
            if (line[i] != first) return false;
        }
        return true;
    }

    private static boolean isBoardFull() {
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                if (board[i][j] == '-') {
                    return false;
                }
            }
        }
        return true;
    }

    private static boolean isValidMove(int row, int col) {
        return board[row][col] == '-';
    }

    private static void updateScore(char winner) {
        if (winner == 'X') {
            playerXWins++;
        } else if (winner == 'O') {
            playerOWins++;
        }
    }

    private static void printScore() {
        System.out.println("\nCurrent Score:");
        System.out.println("Player X: " + playerXWins + " wins");
        System.out.println("Player O: " + playerOWins + " wins");
        System.out.println("Draws: " + draws);
        System.out.println("Total games: " + totalGames);
    }

    private static boolean playAgain() {
        return getYesNoInput("Do you want to play again?");
    }

    private static void changeBoardSize() {
        System.out.println("Current board size: " + boardSize + "x" + boardSize);
        boardSize = getValidInput("Enter new board size (" + MIN_BOARD_SIZE + " to " + MAX_BOARD_SIZE + "): ", MIN_BOARD_SIZE, MAX_BOARD_SIZE);
        System.out.println("Board size changed to " + boardSize + "x" + boardSize);
    }

    private static void setDifficultyLevel() {
        System.out.println("Current difficulty: " + DIFFICULTY_NAMES[difficultyLevel - 1]);
        difficultyLevel = getValidInput("Enter difficulty level (1-" + MAX_DIFFICULTY + "): ", 1, MAX_DIFFICULTY);
        System.out.println("Difficulty set to " + DIFFICULTY_NAMES[difficultyLevel - 1]);
    }

    private static void viewGameHistory() {
        if (gameHistory.isEmpty()) {
            System.out.println("No game history available.");
        } else {
            System.out.println("\nGame History:");
            for (int i = 0; i < gameHistory.size(); i++) {
                System.out.println((i + 1) + ". " + gameHistory.get(i));
            }
        }
    }

    private static void viewStatistics() {
        System.out.println("\nGame Statistics:");
        System.out.println("Total games played: " + totalGames);
        System.out.println("Player X wins: " + playerXWins + " (" + calculatePercentage(playerXWins, totalGames) + "%)");
        System.out.println("Player O wins: " + playerOWins + " (" + calculatePercentage(playerOWins, totalGames) + "%)");
        System.out.println("Draws: " + draws + " (" + calculatePercentage(draws, totalGames) + "%)");
        System.out.println("Current board size: " + boardSize + "x" + boardSize);
        System.out.println("Current difficulty level: " + DIFFICULTY_NAMES[difficultyLevel - 1]);
    }

    private static double calculatePercentage(int value, int total) {
        return total > 0 ? Math.round((double) value / total * 10000) / 100.0 : 0;
    }

    private static void showHelp() {
        System.out.println("\nEnhanced Tic-Tac-Toe Help:");
        System.out.println("1. The game is played on a square grid of size " + boardSize + "x" + boardSize + ".");
        System.out.println("2. Two players take turns marking empty cells with their symbol (X or O).");
        System.out.println("3. The first player to get " + boardSize + " of their symbols in a row (horizontally, vertically, or diagonally) wins.");
        System.out.println("4. If all cells are filled and no player has won, the game is a draw.");
        System.out.println("5. You can play against a friend or the computer.");
        System.out.println("6. The computer's difficulty can be adjusted in the settings.");
        System.out.println("7. You can change the board size from " + MIN_BOARD_SIZE + " to " + MAX_BOARD_SIZE + ".");
        System.out.println("8. Game history and statistics are saved and can be viewed from the main menu.");
    }

    private static int getValidInput(String prompt, int min, int max) {
        int value;
        while (true) {
            System.out.print(prompt);
            if (scanner.hasNextInt()) {
                value = scanner.nextInt();
                if (value >= min && value <= max) {
                    break;
                } else {
                    System.out.println("Invalid input. Please enter a number between " + min + " and " + max + ".");
                }
            } else {
                System.out.println("Invalid input. Please enter a number.");
                scanner.next(); // Clear invalid input
            }
        }
        return value;
    }

    private static boolean getYesNoInput(String prompt) {
        while (true) {
            System.out.print(prompt + " (yes/no): ");
            String input = scanner.next().toLowerCase();
            if (input.equals("yes") || input.equals("y")) {
                return true;
            } else if (input.equals("no") || input.equals("n")) {
                return false;
            } else {
                System.out.println("Invalid input. Please enter 'yes' or 'no'.");
            }
        }
    }

    private static void saveGameHistory() {
        try (FileWriter writer = new FileWriter(GAME_LOG_FILE, true)) {
            for (String game : gameHistory) {
                writer.write(game + "\n");
            }
            writer.write("Session ended at " + getCurrentDateTime() + "\n\n");
            System.out.println("Game history saved to " + GAME_LOG_FILE);
        } catch (IOException e) {
            System.out.println("An error occurred while saving the game history.");
            e.printStackTrace();
        }
    }

    private static void logGame(String result) {
        try (FileWriter writer = new FileWriter(GAME_LOG_FILE, true)) {
            writer.write(getCurrentDateTime() + " - " + result + "\n");
        } catch (IOException e) {
            System.out.println("An error occurred while logging the game.");
            e.printStackTrace();
        }
    }

    private static String getCurrentDateTime() {
        LocalDateTime now = LocalDateTime.now();
        return dtf.format(now);
    }

    private static void loadGameHistory() {
        // This method would load the game history from the log file
        // For simplicity, we're not implementing this in this version
        System.out.println("Game history loading is not implemented in this version.");
    }

    private static void animateComputerThinking() {
        System.out.print("Computer is thinking");
        for (int i = 0; i < 3; i++) {
            try {
                Thread.sleep(500);
                System.out.print(".");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println();
    }

    private static void displayWelcomeMessage() {
        System.out.println("*************************************");
        System.out.println("*                                   *");
        System.out.println("*     Welcome to Tic-Tac-Toe!       *");
        System.out.println("*        Enhanced Edition           *");
        System.out.println("*                                   *");
        System.out.println("*************************************");
    }

    private static void displayGameOverMessage(String result) {
        System.out.println("\n*************************************");
        System.out.println("*                                   *");
        System.out.println("*           Game Over!              *");
        System.out.println("*        " + centerString(result, 25) + "        *");
        System.out.println("*                                   *");
        System.out.println("*************************************");
    }

    private static String centerString(String s, int width) {
        return String.format("%-" + width + "s", String.format("%" + (s.length() + (width - s.length()) / 2) + "s", s));
    }

    private static void clearScreen() {
        for (int i = 0; i < 50; i++) {
            System.out.println();
        }
    }

    public static void main(String[] args) {
        displayWelcomeMessage();
        boardSize = getValidInput("Enter the board size (" + MIN_BOARD_SIZE + " to " + MAX_BOARD_SIZE + "): ", MIN_BOARD_SIZE, MAX_BOARD_SIZE);
        loadGameHistory();
        
        while (true) {
            clearScreen();
            mainMenu();
            if (!playAgain()) {
                saveGameHistory();
                displayGameOverMessage("Thanks for playing!");
                break;
            }
        }
    }
}