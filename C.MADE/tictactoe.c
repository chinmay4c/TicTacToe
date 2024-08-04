#include <stdio.h>

#define SIZE 3

void printBoard(char board[SIZE][SIZE]);
int checkWin(char board[SIZE][SIZE]);
int checkDraw(char board[SIZE][SIZE]);
void getMove(int *row, int *col);
int isValidMove(char board[SIZE][SIZE], int row, int col);

int main() {
    char board[SIZE][SIZE] = { {' ', ' ', ' '}, {' ', ' ', ' '}, {' ', ' ', ' '} };
    int row, col;
    int player = 1; // Player 1 starts
    int win = 0;
    int draw = 0;

    while (!win && !draw) {
        printBoard(board);

        printf("Player %d's turn (row and column): ", player);
        getMove(&row, &col);

        if (isValidMove(board, row, col)) {
            board[row][col] = (player == 1) ? 'X' : 'O';
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

void getMove(int *row, int *col) {
    scanf("%d %d", row, col);
    (*row)--;
    (*col)--;
}

int isValidMove(char board[SIZE][SIZE], int row, int col) {
    return row >= 0 && row < SIZE && col >= 0 && col < SIZE && board[row][col] == ' ';
}

int checkWin(char board[SIZE][SIZE]) {
    // Check rows and columns
    for (int i = 0; i < SIZE; i++) {
        if (board[i][0] != ' ' && board[i][0] == board[i][1] && board[i][1] == board[i][2]) return 1;
        if (board[0][i] != ' ' && board[0][i] == board[1][i] && board[1][i] == board[2][i]) return 1;
    }

    // Check diagonals
    if (board[0][0] != ' ' && board[0][0] == board[1][1] && board[1][1] == board[2][2]) return 1;
    if (board[0][2] != ' ' && board[0][2] == board[1][1] && board[1][1] == board[2][0]) return 1;

    return 0;
}

int checkDraw(char board[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            if (board[i][j] == ' ') return 0;
        }
    }
    return 1;
}
