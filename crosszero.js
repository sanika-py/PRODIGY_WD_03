const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const winningMessage = document.getElementById('winning-message');
const winnerText = document.getElementById('winner-text');
const restartButton = document.getElementById('restart-button');
const messageRestartButton = document.getElementById('message-restart-button');
const newGameButton = document.getElementById('new-game-button');
const turnIndicator = document.getElementById('turn-indicator');
const playerXInfo = document.getElementById('player-x');
const playerOInfo = document.getElementById('player-o');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const gamesPlayed = document.getElementById('games-played');
const draws = document.getElementById('draws');

let currentPlayer = 'X';
let gameActive = true;
let xWins = 0;
let oWins = 0;
let totalDraws = 0;
let totalGames = 0;

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
  [0, 4, 8], [2, 4, 6]              // Diagonals
];

// Initialize the game
startGame();

function startGame() {
  cells.forEach(cell => {
    cell.classList.remove('X', 'O', 'win-cell');
    cell.textContent = ''; // Clear X or O from previous game
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });

  winningMessage.classList.remove('show');
  gameActive = true;
  currentPlayer = 'X';
  updateTurnIndicator();
  highlightActivePlayer();
}

function newGame() {
  xWins = 0;
  oWins = 0;
  totalDraws = 0;
  totalGames = 0;
  updateScoreBoard();
  startGame();
}

function handleClick(e) {
  if (!gameActive) return;

  const cell = e.target;
  placeMark(cell);

  if (checkWin(currentPlayer)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    updateTurnIndicator();
    highlightActivePlayer();
  }
}

function placeMark(cell) {
  cell.classList.add(currentPlayer);
  cell.textContent = currentPlayer; // ✅ Fix: Show "X" or "O"

  // Add animation effect
  cell.style.transform = 'scale(0)';
  setTimeout(() => {
    cell.style.transform = 'scale(1)';
  }, 100);
}

function swapTurns() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function updateTurnIndicator() {
  const xIcon = '<i class="fas fa-times x-icon"></i>';
  const oIcon = '<i class="fas fa-circle o-icon"></i>';

  if (currentPlayer === 'X') {
    turnIndicator.innerHTML = `<i class="fas fa-arrow-right"></i> Current Turn: ${xIcon} Player X`;
  } else {
    turnIndicator.innerHTML = `<i class="fas fa-arrow-right"></i> Current Turn: ${oIcon} Player O`;
  }
}

function highlightActivePlayer() {
  if (currentPlayer === 'X') {
    playerXInfo.classList.add('active');
    playerOInfo.classList.remove('active');
  } else {
    playerOInfo.classList.add('active');
    playerXInfo.classList.remove('active');
  }
}

function checkWin(player) {
  return WINNING_COMBINATIONS.some(combination => {
    const isWinning = combination.every(index => {
      return cells[index].classList.contains(player);
    });

    if (isWinning) {
      highlightWinningCombo(combination);
    }

    return isWinning;
  });
}

function highlightWinningCombo(combo) {
  combo.forEach(index => {
    cells[index].classList.add('win-cell');
  });
}

function isDraw() {
  return [...cells].every(cell => {
    return cell.classList.contains('X') || cell.classList.contains('O');
  });
}

function endGame(draw) {
  gameActive = false;
  totalGames++;

  if (draw) {
    winnerText.textContent = "It's a Draw!";
    winnerText.className = "draw-text";
    totalDraws++;
  } else {
    winnerText.textContent = `${currentPlayer} Wins!`;
    winnerText.className = currentPlayer === 'X' ? "x-win" : "o-win";

    if (currentPlayer === 'X') {
      xWins++;
    } else {
      oWins++;
    }
  }

  updateScoreBoard();
  winningMessage.classList.add('show');
}

function updateScoreBoard() {
  scoreX.textContent = xWins;
  scoreO.textContent = oWins;
  gamesPlayed.textContent = totalGames;
  draws.textContent = totalDraws;
}

// Event listeners
restartButton.addEventListener('click', startGame);
messageRestartButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', newGame);

// Initialize turn UI
updateTurnIndicator();
highlightActivePlayer();
