import sys
from pathlib import Path

# Add the project root to Python's import path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from app import app
from sudoku_app.game import count_solutions, generate_puzzle, is_complete_board
import sudoku_logic


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_home_page(client):
    response = client.get("/")
    assert response.status_code == 200
    assert 'id="timer"' in response.get_data(as_text=True)


def test_new_game_returns_solution_for_hints(client):
    response = client.get("/new")
    assert response.status_code == 200
    data = response.get_json()
    assert "solution" in data
    assert len(data["solution"]) == sudoku_logic.SIZE


def test_generated_puzzle_has_unique_solution():
    puzzle, _ = generate_puzzle(35)
    assert count_solutions(puzzle, limit=2) == 1


def test_complete_board_detection():
    solution = [[1, 2, 3, 4, 5, 6, 7, 8, 9], [4, 5, 6, 7, 8, 9, 1, 2, 3], [7, 8, 9, 1, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 7, 8, 9, 1], [5, 6, 7, 8, 9, 1, 2, 3, 4], [8, 9, 1, 2, 3, 4, 5, 6, 7], [3, 4, 5, 6, 7, 8, 9, 1, 2], [6, 7, 8, 9, 1, 2, 3, 4, 5], [9, 1, 2, 3, 4, 5, 6, 7, 8]]
    board = [row[:] for row in solution]
    assert is_complete_board(board, solution) is True
    board[0][0] = 2
    assert is_complete_board(board, solution) is False


def test_legacy_sudoku_logic_module_still_works():
    puzzle, solution = sudoku_logic.generate_puzzle(35)
    assert len(puzzle) == sudoku_logic.SIZE
    assert len(solution) == sudoku_logic.SIZE
    assert isinstance(puzzle, list)
    assert isinstance(solution, list)