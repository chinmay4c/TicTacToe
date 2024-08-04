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

    public static void main(String[] args) {
        System.out.print("Enter the board size (n x n): ");
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
                    break;
                }
                if (isBoardFull()) {
                    System.out.println("The game is a draw!");
                    draws++;
                    printScore();
                    break;
                }
                switchPlayer();
            }
            if (!playAgain()) {
                System.out.println("Thank you for playing!");
                break;
            }
        }
    }

    private static void mainMenu() {
        System.out.println("Welcome to Tic-Tac-Toe!");
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
        System.out.print("   ");
        for (int i = 0; i < boardSize; i++) {
            System.out.print(i + " ");
        }
        System.out.println();
        for (int i = 0; i < boardSize; i++) {
            System.out.print(i + "  ");
            for (int j = 0; j < boardSize; j++) {
                System.out.print(board[i][j] + " ");
            }
            System.out.println();
        }
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
        int row, col;

        // Check if computer can win in the next move
        if (findBestMove('O') != null) {
            row = findBestMove('O')[0];
            col = findBestMove('O')[1];
        }
        // Block player from winning
        else if (findBestMove('X') != null) {
            row = findBestMove('X')[0];
            col = findBestMove('X')[1];
        }
        // Take the center if available
        else if (board[boardSize / 2][boardSize / 2] == '-') {
            row = boardSize / 2;
            col = boardSize / 2;
        }
        // Take a random available move
        else {
            while (true) {
                row = random.nextInt(boardSize);
                col = random.nextInt(boardSize);
                if (board[row][col] == '-') {
                    break;
                }
            }
        }

        board[row][col] = currentPlayer;
    }

    private static int[] findBestMove(char player) {
        int[] bestMove = null;

        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                if (board[i][j] == '-') {
                    board[i][j] = player;
                    if (isWinner()) {
                        board[i][j] = '-';
                        bestMove = new int[]{i, j};
                        return bestMove;
                    }
                    board[i][j] = '-';
                }
            }
        }
        return bestMove;
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
        System.out.println("Scoreboard:");
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
