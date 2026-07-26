"""Sudoku puzzle generation and validation helpers."""

import copy
import random

SIZE = 9
EMPTY = 0


def deep_copy(board):
    """Return a deep copy of the given puzzle board."""
    return copy.deepcopy(board)


def create_empty_board():
    """Create a new empty Sudoku board."""
    return [[EMPTY for _ in range(SIZE)] for _ in range(SIZE)]


def is_safe(board, row, col, num):
    """Return True when placing num at the given position is valid."""
    for x in range(SIZE):
        if board[row][x] == num or board[x][col] == num:
            return False

    start_row = row - row % 3
    start_col = col - col % 3
    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False
    return True


def fill_board(board):
    """Recursively fill the board with a valid Sudoku solution."""
    for row in range(SIZE):
        for col in range(SIZE):
            if board[row][col] == EMPTY:
                possible = list(range(1, SIZE + 1))
                random.shuffle(possible)
                for candidate in possible:
                    if is_safe(board, row, col, candidate):
                        board[row][col] = candidate
                        if fill_board(board):
                            return True
                        board[row][col] = EMPTY
                return False
    return True


def find_empty_cell(board):
    """Return the next empty cell, or None if the board is complete."""
    for row in range(SIZE):
        for col in range(SIZE):
            if board[row][col] == EMPTY:
                return row, col
    return None


def count_solutions(board, limit=2):
    """Count the number of valid solutions for the supplied board."""
    empty_cell = find_empty_cell(board)
    if empty_cell is None:
        return 1

    row, col = empty_cell
    possible = list(range(1, SIZE + 1))
    random.shuffle(possible)
    solutions = 0

    for candidate in possible:
        if not is_safe(board, row, col, candidate):
            continue

        board[row][col] = candidate
        solutions += count_solutions(board, limit - solutions)
        board[row][col] = EMPTY

        if solutions >= limit:
            return solutions

    return solutions


def remove_cells(board, clues):
    """Remove cells only while keeping exactly one valid solution."""
    target_removals = SIZE * SIZE - clues
    cells = list(range(SIZE * SIZE))
    random.shuffle(cells)

    removed = 0
    for index in cells:
        if removed >= target_removals:
            break

        row, col = divmod(index, SIZE)
        if board[row][col] == EMPTY:
            continue

        value = board[row][col]
        board[row][col] = EMPTY
        if count_solutions(board, limit=2) != 1:
            board[row][col] = value
        else:
            removed += 1


def generate_puzzle(clues=35):
    """Generate a new Sudoku puzzle and its solved answer."""
    board = create_empty_board()
    fill_board(board)
    solution = deep_copy(board)
    remove_cells(board, clues)
    puzzle = deep_copy(board)
    return puzzle, solution


def validate_solution(board, solution):
    """Return a list of incorrect board coordinates compared to the solution."""
    incorrect = []
    for i in range(SIZE):
        for j in range(SIZE):
            if board[i][j] != solution[i][j]:
                incorrect.append([i, j])
    return incorrect


def is_complete_board(board, solution):
    """Return True when every cell matches the solution board."""
    return validate_solution(board, solution) == []
