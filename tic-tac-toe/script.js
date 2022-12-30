const innerBoardElem = document.querySelector('.inner-board');
const gameOverMessageElem = document.querySelector('.game-message');
const gameOutcomeMessage = document.querySelector('#game-outcome-message');

const gameBoard = ((board) => {
  let state = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  function getState() {
    let stateCopy = [];
    for (const row of state) {
      let rowCopy = [];
      for (const val of row) {
        rowCopy.push(val);
      }
      stateCopy.push(rowCopy);
    }
    return stateCopy;
  }

  // place a piece
  function placePiece(row, col, piece) {
    let piecePlaced = false;
    if (
      typeof +row === 'number' &&
      !Number.isNaN(+row) &&
      typeof +col === 'number' &&
      !Number.isNaN(+col)
    ) {
      if (state[row][col] !== 'X' && state[row][col] !== 'O') {
        state[row][col] = piece;
        piecePlaced = true;
      }
    }
    refreshDisplay();
    return piecePlaced;
  }

  // display the board based on the state
  function refreshDisplay() {
    board.replaceChildren();
    for (let rowIndex = 0; rowIndex < state.length; rowIndex++) {
      let rowState = state[rowIndex];
      for (let colIndex = 0; colIndex < rowState.length; colIndex++) {
        let squareState = rowState[colIndex];
        let squareElem = document.createElement('div');
        squareElem.setAttribute('data-row', rowIndex);
        squareElem.setAttribute('data-col', colIndex);
        if (squareState === 'X') {
          squareElem.classList.add('x-piece');
        }
        if (squareState === 'O') {
          squareElem.classList.add('o-piece');
        }
        board.appendChild(squareElem);
      }
    }
  }

  // remove all pieces from the board
  function reset() {
    state = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    refreshDisplay();
  }

  return { getState, refreshDisplay, placePiece, reset };
})(innerBoardElem);

const gameStateController = ((gameBoard) => {
  let winningPlayer = null;
  let gameOver = false;
  let players = [];
  let currentPlayer;
  const player1WinMessage = 'Player 1 wins!';
  const player2WinMessage = 'Player 2 wins!';
  const drawMessage = 'Draw!';

  function refreshGameOverMessageDisplay() {
    gameOutcomeMessage.textContent = getGameOutcomeMessage();
    if (gameOver) {
      gameOverMessageElem.style.display = 'inline-block';
    } else {
      gameOverMessageElem.style.display = 'none';
    }
  }

  function getGameOutcomeMessage() {
    if (winningPlayer == players[0]) {
      return player1WinMessage;
    }
    if (winningPlayer == players[1]) {
      return player2WinMessage;
    }
    if (winningPlayer == null) {
      return drawMessage;
    }
  }

  function startNewGame() {
    winningPlayer = null;
    gameOver = false;
    players = [playerFactory('X', 'Player'), playerFactory('O', 'Computer')];
    currentPlayer = players[0];
    refreshGameOverMessageDisplay();
    gameBoard.reset();
  }

  function toggleCurrentPlayer() {
    if (currentPlayer === players[0]) {
      currentPlayer = players[1];
    } else {
      currentPlayer = players[0];
    }
  }

  function checkIfPlayerWon(playerPiece) {
    const gameBoardState = gameBoard.getState();

    // game draw check
    if (
      gameBoardState[0][0] !== '' &&
      gameBoardState[0][1] !== '' &&
      gameBoardState[0][2] !== '' &&
      gameBoardState[1][0] !== '' &&
      gameBoardState[1][1] !== '' &&
      gameBoardState[1][2] !== '' &&
      gameBoardState[2][0] !== '' &&
      gameBoardState[2][1] !== '' &&
      gameBoardState[2][2] !== ''
    ) {
      winningPlayer = null;
      gameOver = true;
      refreshGameOverMessageDisplay();
      return;
    }

    for (let i = 0; i < gameBoardState.length; i++) {
      let row = gameBoardState[i];
      let column = gameBoardState.map((row) => row[i]);
      // row checks
      if (row.every((val) => val === playerPiece)) {
        console.log(`row #${i} check is met`);
        winningPlayer = currentPlayer;
        gameOver = true;
        refreshGameOverMessageDisplay();
        return;
      }
      // column checks
      if (column.every((val) => val === playerPiece)) {
        console.log(`col #${i} check is met`);
        winningPlayer = currentPlayer;
        gameOver = true;
        refreshGameOverMessageDisplay();
        return;
      }
    }
    // diagonal checks
    if (
      gameBoardState[0][0] === playerPiece &&
      gameBoardState[1][1] === playerPiece &&
      gameBoardState[2][2] === playerPiece
    ) {
      console.log(`top-left bottom-right diagonal check is met`);
      winningPlayer = currentPlayer;
      gameOver = true;
      refreshGameOverMessageDisplay();
      return;
    }
    if (
      gameBoardState[2][0] === playerPiece &&
      gameBoardState[1][1] === playerPiece &&
      gameBoardState[0][2] === playerPiece
    ) {
      console.log(`top-left bottom-right diagonal check is met`);
      winningPlayer = currentPlayer;
      gameOver = true;
      refreshGameOverMessageDisplay();
      return;
    }
  }

  function checkIfGameEnded() {
    for (const player of players) {
      checkIfPlayerWon(player.piece);
    }
  }

  return {
    startNewGame,
    checkIfGameEnded,
    toggleCurrentPlayer,
    get winningPlayer() {
      return { ...winningPlayer };
    },
    get currentPlayerPiece() {
      return currentPlayer.piece;
    },
    get gameOver() {
      return gameOver;
    },
  };
})(gameBoard);

function playerFactory(piece, name) {
  return { piece, name };
}

(function main() {
  innerBoardElem.onclick = (e) => {
    if (gameStateController.gameOver) return;
    if ([...e.target.classList].includes('inner-board')) return;
    let square = e.target;
    // place the piece
    const pieceWasPlaced = gameBoard.placePiece(
      square.dataset.row,
      square.dataset.col,
      gameStateController.currentPlayerPiece
    );
    if (pieceWasPlaced) {
      // check if game ended
      gameStateController.checkIfGameEnded();
      // pass the player turn
      gameStateController.toggleCurrentPlayer();
    }
  };
  gameOverMessageElem.onclick = () => {
    gameStateController.startNewGame();
    gameOutcomeMessage.textContent = '';
  };

  gameStateController.startNewGame();
})();
