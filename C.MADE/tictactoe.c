#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define SIZE 3
#define EMPTY ' '

void printBoard(char board[SIZE][SIZE]);
int checkWin(char board[SIZE][SIZE]);
int checkDraw(char board[SIZE][SIZE]);
void getMove(int *row, int *col, char player);
int isValidMove(char board[SIZE][SIZE], int row, int col);
void makeMove(char board[SIZE][SIZE], int row, int col, char player);
void getComputerMove(int *row, int *col, char board[SIZE][SIZE]);
int minimax(char board[SIZE][SIZE], int depth, int isMaximizing);
int evaluateBoard(char board[SIZE][SIZE]);
int isBoardFull(char board[SIZE][SIZE]);

int main() {
    char board[SIZE][SIZE] = { {EMPTY, EMPTY, EMPTY}, {EMPTY, EMPTY, EMPTY}, {EMPTY, EMPTY, EMPTY} };
    int row, col;
    int player = 1; // Player 1 starts
    int win = 0;
    int draw = 0;

    srand(time(NULL)); // Seed the random number generator

    while (!win && !draw) {
        printBoard(board);

        if (player == 1) {
            printf("Player %d's turn (row and column): ", player);
            getMove(&row, &col, 'X');
        } else {
            printf("Computer's turn:\n");
            getComputerMove(&row, &col, board);
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

    if (win) {
        printf("Player %d wins!\n", (player == 1) ? 2 : 1);
    } else if (draw) {
        printf("The game is a draw.\n");
    }

    return 0;
}

void printBoard(char board[SIZE][SIZE]) {
    printf("\n");
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            printf(" %c ", board[i][j]);
            if (j < SIZE - 1) printf("|");
        }
        printf("\n");
        if (i < SIZE - 1) {
            for (int j = 0; j < SIZE; j++) {
                printf("---");
                if (j < SIZE - 1) printf("|");
            }
            printf("\n");
        }
    }
    printf("\n");
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

void getComputerMove(int *row, int *col, char board[SIZE][SIZE]) {
    int bestScore = -1000;
    int bestRow = -1;
    int bestCol = -1;

    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            if (board[i][j] == EMPTY) {
                board[i][j] = 'O'; // Computer's move
                int score = minimax(board, 0, 0); // 0 for minimizing player (AI)
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
