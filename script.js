const boardSize = 5;
const totalTiles = boardSize * boardSize;
let mineLocations = [];
let revealedTiles = 0;
let profit = 0;
let betAmount = 10;
let numberOfMines = 5;
let isGameActive = false;

// DOM Elements
const gameBoard = document.getElementById('gameBoard');
const betInput = document.getElementById('bet');
const minesInput = document.getElementById('mines');
const startButton = document.getElementById('startGame');
const cashOutButton = document.getElementById('cashOut');
const profitNext = document.getElementById('profitNext');
const totalProfit = document.getElementById('totalProfit');

// Sound Effects
const gemSound = document.getElementById('gemSound');
const bombSound = document.getElementById('bombSound');
const cashOutSound = document.getElementById('cashOutSound');

// Event Listeners
startButton.addEventListener('click', startGame);
cashOutButton.addEventListener('click', cashOut);

function startGame() {
  resetGame();
  isGameActive = true;
  betAmount = parseInt(betInput.value);
  numberOfMines = parseInt(minesInput.value);

  generateBoard();
  placeMines();
  updateProfit(0);
  cashOutButton.disabled = false;
}

function resetGame() {
  gameBoard.innerHTML = '';
  mineLocations = [];
  revealedTiles = 0;
  profit = 0;
  isGameActive = false;
  cashOutButton.disabled = true;
  totalProfit.innerText = '0';
  profitNext.innerText = '0';
}

function generateBoard() {
  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.setAttribute('data-id', i);
    tile.addEventListener('click', revealTile);
    gameBoard.appendChild(tile);
  }
}

function placeMines() {
  let minesPlaced = 0;
  while (minesPlaced < numberOfMines) {
    const randomIndex = Math.floor(Math.random() * totalTiles);
    if (!mineLocations.includes(randomIndex)) {
      mineLocations.push(randomIndex);
      minesPlaced++;
    }
  }
}

function revealTile(e) {
  if (!isGameActive) return;

  const tile = e.target;
  const tileId = parseInt(tile.getAttribute('data-id'));

  if (mineLocations.includes(tileId)) {
    tile.classList.add('bomb');
    tile.innerHTML = '<img src="bomb-icon.png" alt="Bomb">';
    bombSound.play();
    gameOver();
  } else {
    tile.classList.add('gem');
    tile.innerHTML = '<img src="gem-icon.png" alt="Gem">';
    gemSound.play();
    revealedTiles++;
    tile.classList.add('disabled');

    // Calculate Profit
    const currentProfit = calculateProfit();
    updateProfit(currentProfit);
  }
}

function calculateProfit() {
  // Simple profit calculation (you can modify this logic)
  return revealedTiles * (betAmount / numberOfMines);
}

function updateProfit(currentProfit) {
  profitNext.innerText = currentProfit.toFixed(2);
  totalProfit.innerText = (profit + currentProfit).toFixed(2);
}

function cashOut() {
  if (!isGameActive) return;

  cashOutSound.play();
  profit += parseFloat(profitNext.innerText);
  isGameActive = false;
  cashOutButton.disabled = true;
  alert(`You cashed out with a profit of ${profit.toFixed(2)}!`);
  resetGame();
}

function gameOver() {
  isGameActive = false;
  cashOutButton.disabled = true;
  alert('Game over! You hit a bomb.');
  resetGame();
}
