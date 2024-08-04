import java.util.Scanner;

public class TicTacToe {

    private static char[][] board = new char[3][3];
    private static char currentPlayer;
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        while (true) {
            mainMenu();
            initializeBoard();
            currentPlayer = 'X';
            printBoard();
            while (true) {
                playerMove();
                printBoard();
                if (isWinner()) {
                    System.out.println("Player " + currentPlayer + " wins!");
                    break;
                }
                if (isBoardFull()) {
                    System.out.println("The game is a draw!");
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
        System.out.println("2. Exit");
        while (true) {
            System.out.print("Enter your choice: ");
            int choice = getValidInput(1, 2);
            if (choice == 1) {
                break;
            } else if (choice == 2) {
                System.out.println("Goodbye!");
                System.exit(0);
            } else {
                System.out.println("Invalid choice. Please choose 1 or 2.");
            }
        }
    }

    private static void initializeBoard() {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                board[i][j] = '-';
            }
        }
    }

    private static void printBoard() {
        System.out.println("  0 1 2");
        for (int i = 0; i < 3; i++) {
            System.out.print(i + " ");
            for (int j = 0; j < 3; j++) {
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

    private static int getValidInput(String coordinate) {
        int value;
        while (true) {
            System.out.print(coordinate + " (0, 1, or 2): ");
            if (scanner.hasNextInt()) {
                value = scanner.nextInt();
                if (value >= 0 && value <= 2) {
                    break;
                } else {
                    System.out.println("Invalid " + coordinate + ". Please enter 0, 1, or 2.");
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
        for (int i = 0; i < 3; i++) {
            if ((board[i][0] == currentPlayer && board[i][1] == currentPlayer && board[i][2] == currentPlayer) ||
                (board[0][i] == currentPlayer && board[1][i] == currentPlayer && board[2][i] == currentPlayer)) {
                return true;
            }
        }
        // Check diagonals
        if ((board[0][0] == currentPlayer && board[1][1] == currentPlayer && board[2][2] == currentPlayer) ||
            (board[0][2] == currentPlayer && board[1][1] == currentPlayer && board[2][0] == currentPlayer)) {
            return true;
        }
        return false;
    }

    private static boolean isBoardFull() {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == '-') {
                    return false;
                }
            }
        }
        return true;
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
