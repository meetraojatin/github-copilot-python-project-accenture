"""Route definitions for the Sudoku Flask app."""

from flask import Blueprint, jsonify, render_template, request

from .game import generate_puzzle, validate_solution

bp = Blueprint("main", __name__)

CURRENT = {
    "puzzle": None,
    "solution": None,
}


@bp.route("/")
def index():
    return render_template("index.html")


@bp.route("/new")
def new_game():
    clues = int(request.args.get("clues", 35))
    puzzle, solution = generate_puzzle(clues)
    CURRENT["puzzle"] = puzzle
    CURRENT["solution"] = solution
    return jsonify({"puzzle": puzzle, "solution": solution})


@bp.route("/check", methods=["POST"])
def check_solution():
    data = request.json
    board = data.get("board")
    solution = CURRENT.get("solution")
    if solution is None:
        return jsonify({"error": "No game in progress"}), 400

    incorrect = validate_solution(board, solution)
    return jsonify({"incorrect": incorrect})
