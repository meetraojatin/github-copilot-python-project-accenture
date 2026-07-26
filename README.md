# Flask Sudoku Game

## Project Overview

This project is a web-based Sudoku game built with Flask and Python. It provides a simple browser interface where players can start a new puzzle, enter values into a 9x9 grid, use hints, check their solution, and track completion time. The game logic uses a backtracking-based solver to generate a valid Sudoku board and remove cells while preserving a unique solution.

## Features

- Generates a new Sudoku puzzle and its solved answer from the server
- Renders an interactive 9x9 game board in the browser
- Highlights invalid entries as the player types
- Includes a hint button that reveals a correct value for an empty cell
- Supports solution checking to identify incorrect positions
- Starts a timer when a new game begins
- Displays a local leaderboard for completed games in the browser
- Includes a simple player-name input and a difficulty selector in the UI

## Technologies Used

- Python
- Flask
- HTML, CSS, and JavaScript
- pytest for automated testing

## Project Structure

```text
starter/
├── app.py
├── requirements.txt
├── sudoku_logic.py
├── sudoku_app/
│   ├── __init__.py
│   ├── game.py
│   ├── routes.py
│   ├── static/
│   │   ├── main.js
│   │   └── styles.css
│   └── templates/
│       └── index.html
└── tests/
    └── test_app.py
```

## Installation Instructions

1. Clone the repository to your local machine.
2. Navigate to the project folder.
3. Create and activate a virtual environment.

```bash
cd starter
python -m venv .venv
```

Activate the environment:

```bash
# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

4. Install the required dependencies.

```bash
pip install -r requirements.txt
```

## How to Run the Application

From the project root, run:

```bash
cd starter
python app.py
```

Then open your browser and visit:

```text
http://127.0.0.1:5000
```

## How to Run the Tests

Run the test suite with:

```bash
pytest starter/tests/test_app.py
```

## Future Improvements

Potential enhancements for the project include:

- Adding more distinct difficulty levels with varying puzzle complexity
- Improving the visual design and responsiveness of the interface
- Persisting leaderboard data on the server instead of only in the browser
- Adding support for keyboard shortcuts and mobile-friendly controls

## License

This project is distributed under the license provided in the repository's LICENSE.txt file.
