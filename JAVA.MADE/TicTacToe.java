import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;

public class TicTacToe {

    private static char[][] board;
    private static int boardSize;
    private static char currentPlayer;
    private static int playerXWins = 0;
    private static int playerOWins = 0;
    private static int draws = 0;
    private static Scanner scanner = new Scanner(System.in);
    private static Random random = new Random();
    private static List<String> gameHistory = new ArrayList<>();

    public static void main(String[] args) {
        System.out.print("Enter the board size (3 to 20): ");
        boardSize = getValidInput(3, 20);
        board = new char[boardSize][boardSize];
        
        while (true) {
            mainMenu();
            initializeBoard();
            currentPlayer = 'X';
            printBoard();
            while (true) {
                if (currentPlayer == 'X') {
                    playerMove();
                } else {
                    computerMove();
                }
                printBoard();
                if (isWinner()) {
                    System.out.println("Player " + currentPlayer + " wins!");
                    updateScore(currentPlayer);
                    printScore();
                    gameHistory.add("Player " + currentPlayer + " won!");
                    break;
                }
                if (isBoardFull()) {
                    System.out.println("The game is a draw!");
                    draws++;
                    printScore();
                    gameHistory.add("The game is a draw.");
                    break;
                }
                switchPlayer();
            }
            if (!playAgain()) {
                System.out.println("Game History:");
                for (String record : gameHistory) {
                    System.out.println(record);
                }
                System.out.println("Thank you for playing!");
                break;
            }
        }
    }

    private static void mainMenu() {
        System.out.println("\nWelcome to Tic-Tac-Toe!");
        System.out.println("1. Play");
        System.out.println("2. Help");
        System.out.println("3. Exit");
        while (true) {
            System.out.print("Enter your choice: ");
            int choice = getValidInput(1, 3);
            if (choice == 1) {
                break;
            } else if (choice == 2) {
                showHelp();
            } else if (choice == 3) {
                System.out.println("Goodbye!");
                System.exit(0);
            } else {
                System.out.println("Invalid choice. Please choose 1, 2, or 3.");
            }
        }
    }

    private static void showHelp() {
        System.out.println("\nTic-Tac-Toe is a simple game for two players.");
        System.out.println("Players take turns marking a cell in an " + boardSize + "x" + boardSize + " grid with their symbol (X or O).");
        System.out.println("The first player to get " + boardSize + " of their symbols in a row (horizontally, vertically, or diagonally) wins the game.");
        System.out.println("If all cells are marked and no player has " + boardSize + " in a row, the game is a draw.\n");
    }

    private static void initializeBoard() {
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                board[i][j] = '-';
            }
        }
    }

    private static void printBoard() {
        System.out.println("   " + String.join(" ", generateIndexLine()));
        for (int i = 0; i < boardSize; i++) {
            System.out.print(i + " ");
            for (int j = 0; j < boardSize; j++) {
                char cell = board[i][j];
                System.out.print(cell + " ");
            }
            System.out.println();
        }
    }

    private static List<String> generateIndexLine() {
        List<String> indexLine = new ArrayList<>();
        for (int i = 0; i < boardSize; i++) {
            indexLine.add(String.valueOf(i));
        }
        return indexLine;
    }

    private static void playerMove() {
        int row, col;
        while (true) {
            System.out.println("Player " + currentPlayer + ", enter your move (row and column): ");
            row = getValidInput("Row");
            col = getValidInput("Column");
            if (board[row][col] == '-') {
                board[row][col] = currentPlayer;
                break;
            } else {
                System.out.println("This move is not valid. The cell is already occupied.");
            }
        }
    }

    private static void computerMove() {
        System.out.println("Computer's turn:");
        int[] bestMove = minimax(board, currentPlayer);
        int row = bestMove[0];
        int col = bestMove[1];

        board[row][col] = currentPlayer;
    }

    private static int[] minimax(char[][] board, char player) {
        char opponent = (player == 'X') ? 'O' : 'X';
        int bestScore = (player == 'X') ? Integer.MIN_VALUE : Integer.MAX_VALUE;
        int[] bestMove = {-1, -1};

        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                if (board[i][j] == '-') {
                    board[i][j] = player;
                    int score = minimaxScore(board, player);
                    board[i][j] = '-';

                    if ((player == 'X' && score > bestScore) || (player == 'O' && score < bestScore)) {
                        bestScore = score;
                        bestMove[0] = i;
                        bestMove[1] = j;
                    }
                }
            }
        }
        return bestMove;
    }

    private static int minimaxScore(char[][] board, char player) {
        char opponent = (player == 'X') ? 'O' : 'X';

        if (isWinner()) {
            return (player == 'X') ? 1 : -1;
        }
        if (isBoardFull()) {
            return 0;
        }

        int bestScore = (player == 'X') ? Integer.MIN_VALUE : Integer.MAX_VALUE;

        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                if (board[i][j] == '-') {
                    board[i][j] = player;
                    int score = minimaxScore(board, opponent);
                    board[i][j] = '-';

                    if ((player == 'X' && score > bestScore) || (player == 'O' && score < bestScore)) {
                        bestScore = score;
                    }
                }
            }
        }
        return bestScore;
    }

    private static int getValidInput(String coordinate) {
        int value;
        while (true) {
            System.out.print(coordinate + " (0 to " + (boardSize - 1) + "): ");
            if (scanner.hasNextInt()) {
                value = scanner.nextInt();
                if (value >= 0 && value < boardSize) {
                    break;
                } else {
                    System.out.println("Invalid " + coordinate + ". Please enter a number between 0 and " + (boardSize - 1) + ".");
                }
            } else {
                System.out.println("Invalid input. Please enter a number.");
                scanner.next(); // Clear invalid input
            }
        }
        return value;
    }

    private static int getValidInput(int min, int max) {
        int value;
        while (true) {
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
        if (checkDiagonal() || checkAntiDiagonal()) {
            return true;
        }
        return false;
    }

    private static boolean checkLine(char[] line) {
        for (int i = 1; i < boardSize; i++) {
            if (line[i] != currentPlayer) {
                return false;
            }
        }
        return true;
    }

    private static char[] getColumn(int col) {
        char[] column = new char[boardSize];
        for (int i = 0; i < boardSize; i++) {
            column[i] = board[i][col];
        }
        return column;
    }

    private static boolean checkDiagonal() {
        for (int i = 1; i < boardSize; i++) {
            if (board[i][i] != currentPlayer) {
                return false;
            }
        }
        return true;
    }

    private static boolean checkAntiDiagonal() {
        for (int i = 1; i < boardSize; i++) {
            if (board[i][boardSize - 1 - i] != currentPlayer) {
                return false;
            }
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

    private static void updateScore(char winner) {
        if (winner == 'X') {
            playerXWins++;
        } else if (winner == 'O') {
            playerOWins++;
        }
    }

    private static void printScore() {
        System.out.println("\nScoreboard:");
        System.out.println("Player X: " + playerXWins + " wins");
        System.out.println("Player O: " + playerOWins + " wins");
        System.out.println("Draws: " + draws);
    }

    private static boolean playAgain() {
        System.out.println("Do you want to play again? (yes or no)");
        while (true) {
            String response = scanner.next();
            if (response.equalsIgnoreCase("yes")) {
                return true;
            } else if (response.equalsIgnoreCase("no")) {
                return false;
            } else {
                System.out.println("Invalid input. Please enter 'yes' or 'no'.");
            }
        }
    }
}
