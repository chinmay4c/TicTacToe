#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define SIZE 3
#define EMPTY ' '

void printBoard(char board[SIZE][SIZE]);
void printLine(char board[SIZE][SIZE], int row);
void printHeader();
int checkWin(char board[SIZE][SIZE]);
int checkDraw(char board[SIZE][SIZE]);
void getMove(int *row, int *col, char player);
int isValidMove(char board[SIZE][SIZE], int row, int col);
void makeMove(char board[SIZE][SIZE], int row, int col, char player);
void getComputerMove(int *row, int *col, char board[SIZE][SIZE]);
int minimax(char board[SIZE][SIZE], int depth, int isMaximizing);
int evaluateBoard(char board[SIZE][SIZE]);
int isBoardFull(char board[SIZE][SIZE]);
void printInstructions();
void printGameStatus(int result, char player);
void clearScreen();
void initializeBoard(char board[SIZE][SIZE]);
void playGame();
void chooseDifficulty(int *difficulty);
int getDifficultyAI(int difficulty);

int main() {
    srand(time(NULL)); // Seed the random number generator

    char playAgain;
    int difficulty;

    printInstructions();
    do {
        chooseDifficulty(&difficulty);
        playGame(difficulty);
        printf("Do you want to play again? (y/n): ");
        scanf(" %c", &playAgain);
    } while (playAgain == 'y' || playAgain == 'Y');

    return 0;
}

void printInstructions() {
    printf("Welcome to Tic-Tac-Toe!\n");
    printf("You will play as 'X' against the computer, which plays as 'O'.\n");
    printf("You can choose the difficulty level for the AI:\n");
    printf("1. Easy\n");
    printf("2. Medium\n");
    printf("3. Hard\n");
    printf("Enter the difficulty level (1-3):\n");
}

void chooseDifficulty(int *difficulty) {
    int level;
    while (1) {
        printf("Difficulty level (1-3): ");
        scanf("%d", &level);
        if (level >= 1 && level <= 3) {
            *difficulty = level;
            break;
        }
        printf("Invalid choice. Please select a level between 1 and 3.\n");
    }
}

void printBoard(char board[SIZE][SIZE]) {
    clearScreen();
    printHeader();
    for (int i = 0; i < SIZE; i++) {
        printLine(board, i);
        if (i < SIZE - 1) {
            printf("  ---|---|---\n");
        }
    }
    printf("\n");
}

void printLine(char board[SIZE][SIZE], int row) {
    printf("%d ", row + 1);
    for (int col = 0; col < SIZE; col++) {
        printf(" %c ", board[row][col]);
        if (col < SIZE - 1) {
            printf("|");
        }
    }
    printf("\n");
}

void printHeader() {
    printf("   1   2   3\n");
}

void getMove(int *row, int *col, char player) {
    printf("Enter row and column (1 to %d): ", SIZE);
    scanf("%d %d", row, col);
    (*row)--;
    (*col)--;
}

int isValidMove(char board[SIZE][SIZE], int row, int col) {
    return row >= 0 && row < SIZE && col >= 0 && col < SIZE && board[row][col] == EMPTY;
}

void makeMove(char board[SIZE][SIZE], int row, int col, char player) {
    board[row][col] = player;
}

void getComputerMove(int *row, int *col, char board[SIZE][SIZE], int difficulty) {
    int bestScore = -1000;
    int bestRow = -1;
    int bestCol = -1;

    int depth = getDifficultyAI(difficulty);

    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            if (board[i][j] == EMPTY) {
                board[i][j] = 'O'; // Computer's move
                int score = minimax(board, 0, 1); // 1 for maximizing player (AI)
                board[i][j] = EMPTY; // Undo move
                if (score > bestScore) {
                    bestScore = score;
                    bestRow = i;
                    bestCol = j;
                }
            }
        }
    }

    *row = bestRow;
    *col = bestCol;
}

int getDifficultyAI(int difficulty) {
    switch (difficulty) {
        case 1: return 1; // Easy
        case 2: return 3; // Medium
        case 3: return 5; // Hard
        default: return 1;
    }
}

int minimax(char board[SIZE][SIZE], int depth, int isMaximizing) {
    int score = evaluateBoard(board);

    if (score == 10) return score - depth;
    if (score == -10) return score + depth;
    if (isBoardFull(board)) return 0;

    if (isMaximizing) {
        int best = -1000;
        for (int i = 0; i < SIZE; i++) {
            for (int j = 0; j < SIZE; j++) {
                if (board[i][j] == EMPTY) {
                    board[i][j] = 'O';
                    best = (best > minimax(board, depth + 1, 0)) ? best : minimax(board, depth + 1, 0);
                    board[i][j] = EMPTY;
                }
            }
        }
        return best;
    } else {
        int best = 1000;
        for (int i = 0; i < SIZE; i++) {
            for (int j = 0; j < SIZE; j++) {
                if (board[i][j] == EMPTY) {
                    board[i][j] = 'X';
                    best = (best < minimax(board, depth + 1, 1)) ? best : minimax(board, depth + 1, 1);
                    board[i][j] = EMPTY;
                }
            }
        }
        return best;
    }
}

int evaluateBoard(char board[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        if (board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
            if (board[i][0] == 'O') return 10;
            if (board[i][0] == 'X') return -10;
        }
        if (board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
            if (board[0][i] == 'O') return 10;
            if (board[0][i] == 'X') return -10;
        }
    }
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
        if (board[0][0] == 'O') return 10;
        if (board[0][0] == 'X') return -10;
    }
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
        if (board[0][2] == 'O') return 10;
        if (board[0][2] == 'X') return -10;
    }
    return 0;
}

int isBoardFull(char board[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            if (board[i][j] == EMPTY) return 0;
        }
    }
    return 1;
}

int checkWin(char board[SIZE][SIZE]) {
    return evaluateBoard(board) != 0;
}

int checkDraw(char board[SIZE][SIZE]) {
    return isBoardFull(board) && !checkWin(board);
}

void printGameStatus(int result, char player) {
    if (result == 1) {
        printf("Player %c wins!\n", player);
    } else if (result == 2) {
        printf("The game is a draw.\n");
    } else {
        printf("Unexpected game status.\n");
    }
}

void clearScreen() {
    // System-specific clear screen command
    #ifdef _WIN32
        system("cls");
    #else
        system("clear");
    #endif
}

void initializeBoard(char board[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            board[i][j] = EMPTY;
        }
    }
}

void playGame(int difficulty) {
    char board[SIZE][SIZE];
    initializeBoard(board);

    int row, col;
    int player = 1; // Player 1 starts
    int win = 0;
    int draw = 0;

    while (!win && !draw) {
        printBoard(board);

        if (player == 1) {
            printf("Player %d's turn (row and column): ", player);
            getMove(&row, &col, 'X');
        } else {
            printf("Computer (Difficulty %d) is thinking...\n", difficulty);
            getComputerMove(&row, &col, board, difficulty);
        }

        if (isValidMove(board, row, col)) {
            makeMove(board, row, col, (player == 1) ? 'X' : 'O');
            win = checkWin(board);
            draw = checkDraw(board);
            player = (player == 1) ? 2 : 1; // Switch player
        } else {
            printf("Invalid move. Try again.\n");
        }
    }

    printBoard(board);
    printGameStatus(win ? 1 : (draw ? 2 : 0), (player == 1) ? 'O' : 'X');
}
