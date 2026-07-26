// Client-side rendering and interaction for the Flask-backed Sudoku
const SIZE = 9;
const LEADERBOARD_KEY = 'sudoku-leaderboard';
let puzzle = [];
let solution = [];
let hintsUsed = 0;
let startTime = null;
let timerInterval = null;
let currentDifficulty = 'Easy';
let completionHandled = false;

function createBoardElement() {
  const boardDiv = document.getElementById('sudoku-board');
  boardDiv.innerHTML = '';
  for (let i = 0; i < SIZE; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'sudoku-row';
    for (let j = 0; j < SIZE; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'sudoku-cell';
      input.dataset.row = i;
      input.dataset.col = j;
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^1-9]/g, '');
        e.target.value = val;
        validateEditableCell(input);
        checkCompletionStatus();
      });
      rowDiv.appendChild(input);
    }
    boardDiv.appendChild(rowDiv);
  }
}

function validateEditableCell(input) {
  if (input.disabled) {
    return;
  }

  const row = Number(input.dataset.row);
  const col = Number(input.dataset.col);
  const value = input.value;

  if (!value) {
    input.className = 'sudoku-cell';
    return;
  }

  const board = collectBoardValues();
  const isValid = isBoardValueValid(board, row, col, Number(value));
  input.className = isValid ? 'sudoku-cell' : 'sudoku-cell invalid';
}

function collectBoardValues() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }
  return board;
}

function isBoardValueValid(board, row, col, value) {
  for (let i = 0; i < SIZE; i++) {
    if (i !== col && board[row][i] === value) {
      return false;
    }
    if (i !== row && board[i][col] === value) {
      return false;
    }
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if ((i !== row || j !== col) && board[i][j] === value) {
        return false;
      }
    }
  }

  return true;
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function updateTimer() {
  if (!startTime) {
    return;
  }
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('timer').innerText = formatTime(elapsedSeconds);
}

function startTimer() {
  stopTimer();
  startTime = Date.now();
  updateTimer();
  timerInterval = window.setInterval(updateTimer, 1000);
}

function stopTimer() {
  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
}

function renderPuzzle(puz, sol = []) {
  puzzle = puz;
  solution = sol;
  createBoardElement();
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = puzzle[i][j];
      const inp = inputs[idx];
      if (val !== 0) {
        inp.value = val;
        inp.disabled = true;
        inp.className = 'sudoku-cell prefilled';
      } else {
        inp.value = '';
        inp.disabled = false;
        inp.className = 'sudoku-cell';
      }
    }
  }
  startTimer();
  hintsUsed = 0;
  completionHandled = false;
  document.getElementById('message').innerText = '';
  updateHintButtonState();
}

function getLeaderboard() {
  const raw = localStorage.getItem(LEADERBOARD_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveLeaderboard(entries) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

function renderLeaderboard() {
  const entries = getLeaderboard()
    .sort((a, b) => a.completionTime - b.completionTime)
    .slice(0, 10);
  const list = document.getElementById('leaderboard-list');
  list.innerHTML = '';
  if (entries.length === 0) {
    list.innerHTML = '<li>No scores yet.</li>';
    return;
  }
  entries.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerText = `${index + 1}. ${entry.name} — ${entry.completionTime}s — ${entry.difficulty} — hints: ${entry.hintsUsed}`;
    list.appendChild(li);
  });
}

function addLeaderboardEntry(name, completionTime, difficulty, hintsUsed) {
  const entries = getLeaderboard();
  entries.push({name, completionTime, difficulty, hintsUsed});
  const topEntries = entries
    .sort((a, b) => a.completionTime - b.completionTime)
    .slice(0, 10);
  saveLeaderboard(topEntries);
  renderLeaderboard();
}

function updateHintButtonState() {
  const hintButton = document.getElementById('hint-button');
  const hasRemainingEmptyCells = Array.from(document.getElementById('sudoku-board').getElementsByTagName('input'))
    .some((input) => !input.disabled && !input.value);
  hintButton.disabled = !hasRemainingEmptyCells;
}

function completeGame() {
  if (completionHandled) {
    return;
  }
  completionHandled = true;
  stopTimer();
  const msg = document.getElementById('message');
  msg.style.color = '#388e3c';
  msg.innerText = 'Congratulations! You solved it!';
  const playerName = document.getElementById('player-name').value.trim() || 'Anonymous';
  const completionTime = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
  addLeaderboardEntry(playerName, completionTime, currentDifficulty, hintsUsed);
}

function checkCompletionStatus() {
  if (!solution.length || completionHandled) {
    return;
  }
  const board = collectBoardValues();
  const isComplete = board.every((row, rowIndex) => row.every((value, colIndex) => value === solution[rowIndex][colIndex]));
  if (isComplete) {
    completeGame();
  }
}

function showHint() {
  if (!puzzle.length || !solution.length) return;
  const inputs = document.getElementById('sudoku-board').getElementsByTagName('input');
  const emptyCells = [];
  for (let idx = 0; idx < inputs.length; idx++) {
    const input = inputs[idx];
    if (input.disabled || input.value) continue;
    emptyCells.push(idx);
  }
  if (emptyCells.length === 0) {
    updateHintButtonState();
    return;
  }

  const targetIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const row = Math.floor(targetIndex / SIZE);
  const col = targetIndex % SIZE;
  const value = solution[row][col];

  if (value === 0) {
    return;
  }

  const input = inputs[targetIndex];
  input.value = value;
  input.disabled = true;
  input.className = 'sudoku-cell prefilled hint-cell';
  hintsUsed += 1;
  document.getElementById('message').innerText = 'Hint used.';
  updateHintButtonState();
  checkCompletionStatus();
}

async function newGame() {
  const res = await fetch('/new');
  const data = await res.json();
  currentDifficulty = document.getElementById('difficulty').value;
  renderPuzzle(data.puzzle, data.solution || []);
  document.getElementById('message').innerText = '';
}

async function checkSolution() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }
  const res = await fetch('/check', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });
  const data = await res.json();
  const msg = document.getElementById('message');
  if (data.error) {
    msg.style.color = '#d32f2f';
    msg.innerText = data.error;
    return;
  }
  const incorrect = new Set(data.incorrect.map(x => x[0] * SIZE + x[1]));
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    if (inp.disabled) continue;
    inp.className = 'sudoku-cell';
    if (incorrect.has(idx)) {
      inp.className = 'sudoku-cell incorrect';
    }
  }
  if (incorrect.size === 0) {
    completeGame();
  } else {
    msg.style.color = '#d32f2f';
    msg.innerText = 'Some cells are incorrect.';
  }
}

window.addEventListener('load', () => {
  document.getElementById('new-game').addEventListener('click', newGame);
  document.getElementById('check-solution').addEventListener('click', checkSolution);
  document.getElementById('hint-button').addEventListener('click', showHint);
  renderLeaderboard();
  document.getElementById('timer').innerText = '00:00';
  newGame();
});
