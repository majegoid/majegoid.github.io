// Game result messages
let winGameMessage = `You won the game.`;
let loseGameMessage = `You lost the game.`;
let drawGameMessage = `Neither you nor the computer won the game.`;
// Round result messages
let winRoundMessage = `You won the round.`;
let drawRoundMessage = `The round was a draw.`;
let loseRoundMessage = `You lost the round.`;
// Element Querying
let choosesRockButton = document.querySelector('#chooses-rock');
let choosesPaperButton = document.querySelector('#chooses-paper');
let choosesScissorsButton = document.querySelector('#chooses-scissors');
let playerChoiceButtons = [choosesRockButton, choosesPaperButton, choosesScissorsButton];
playerChoiceButtons.forEach((playerChoiceButton) => {
  let playerChoiceText = Array.from(playerChoiceButton.getAttribute('id').split('-')[1]);
  playerChoiceText.splice(0, 1, playerChoiceText[0].toUpperCase());
  playerChoiceText = playerChoiceText.join('');

  playerChoiceButton.addEventListener('click', (e) => playRound(playerChoiceText));
});
let gameResultsDiv = document.querySelector('#game-results');
let gameScoreH2 = document.querySelector('#game-score');
// Global State
// Participant choices
let playerChoice = '';
let computerChoice = '';
// Player Scores
let computerScore = 0;
let playerScore = 0;
// Game Controls
let roundsPlayed = 0;
const ROUNDS_PER_GAME = 5;

function getComputerChoice() {
  let computerChoiceInt = Math.ceil(Math.random() * 3);
  return getComputerChoiceName(computerChoiceInt);
}

function getComputerChoiceName(choiceInt) {
  switch (choiceInt) {
    case 1:
      return 'Rock';
    case 2:
      return 'Paper';
    case 3:
      return 'Scissors';
    default:
      throw new Error('Computer choice was not 1, 2, or 3');
  }
}

function resetGameState() {
  gameResultsDiv.replaceChildren();
  // Participant choices
  playerChoice = '';
  computerChoice = '';
  // Player Scores
  computerScore = 0;
  playerScore = 0;
  // Game Controls
  roundsPlayed = 0;
}

function playRound(playerChoiceParam) {
  if (roundsPlayed === ROUNDS_PER_GAME) {
    resetGameState();
  }
  playerChoice = playerChoiceParam;
  computerChoice = getComputerChoice();

  // determine who wins
  // draw scenarios
  let roundResult = '';
  if (playerChoice === computerChoice) {
    roundResult = drawRoundMessage;
  }
  // player win scenarios
  if (
    (playerChoice === 'Rock' && computerChoice === 'Scissors') ||
    (playerChoice === 'Paper' && computerChoice === 'Rock') ||
    (playerChoice === 'Scissors' && computerChoice === 'Paper')
  ) {
    roundResult = winRoundMessage;
  }
  // computer win scenarios
  if (
    (computerChoice === 'Rock' && playerChoice === 'Scissors') ||
    (computerChoice === 'Paper' && playerChoice === 'Rock') ||
    (computerChoice === 'Scissors' && playerChoice === 'Paper')
  ) {
    roundResult = loseRoundMessage;
  }
  // round completed, display result and check if game has ended
  roundsPlayed += 1;
  displayRoundResult(roundResult);
  if (roundsPlayed === ROUNDS_PER_GAME) {
    displayGameResult();
  }
}

function displayGameResult() {
  if (playerScore > computerScore) {
    displayTextOnNewLine(winGameMessage);
  }
  if (computerScore > playerScore) {
    displayTextOnNewLine(loseGameMessage);
  }
  if (playerScore === computerScore) {
    displayTextOnNewLine(drawGameMessage);
  }
}

function displayRoundResult(roundResult) {
  if (roundResult === winRoundMessage) {
    playerScore += 1;
  }
  if (roundResult === loseRoundMessage) {
    computerScore += 1;
  }
  displayTextOnNewLine(
    `[Round ${roundsPlayed}/${ROUNDS_PER_GAME}]: You chose: ${playerChoice}, Computer chose: ${computerChoice}.`
  );
  displayTextOnNewLine(`${roundResult}`);
  displayCurrentScore();
}

function displayCurrentScore() {
  gameScoreH2.textContent = `${playerScore}-${computerScore}`;
}

function displayTextOnNewLine(text) {
  gameResultsDiv.appendChild(document.createTextNode(text));
  gameResultsDiv.appendChild(document.createElement('br'));
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('game ready');
});
