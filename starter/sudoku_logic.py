"""Compatibility wrapper for the legacy Sudoku logic module.

This preserves the old import path while delegating to the modular game
helpers in the package-based implementation.
"""

from sudoku_app.game import (  # noqa: F401
    EMPTY,
    SIZE,
    count_solutions,
    create_empty_board,
    deep_copy,
    fill_board,
    generate_puzzle,
    is_safe,
    remove_cells,
    validate_solution,
)

__all__ = [
    "EMPTY",
    "SIZE",
    "count_solutions",
    "create_empty_board",
    "deep_copy",
    "fill_board",
    "generate_puzzle",
    "is_safe",
    "remove_cells",
    "validate_solution",
]

