document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.square');
  const startButton = document.querySelector('#start-game-button');
  const onePlayerButton = document.querySelector('#one-player');
  const twoPlayerButton = document.querySelector('#two-player');

  let numberOfPlayers;
  let playerOneName;
  let playerTwoName;
  let players = { playerOneSymbol: 'X', playerTwoSymbol: 'O' };

  let floatingMessage = document.querySelector('#floating-message');


  onePlayerButton.addEventListener('change', () => {
  	numberOfPlayers = 1;
  	playerOneName = prompt("Please enter player one's name");
  	floatingMessage.innerHTML = 'Please press the start button to begin the game';
  });

  twoPlayerButton.addEventListener('change', () => {
  	numberOfPlayers = 2;
  	playerOneName = prompt("Please enter player one's name");
  	playerTwoName = prompt("Please enter player two's name");
  	floatingMessage.innerHTML = 'Please press the start button to begin the game';
  });

  function disableSquares() {
	  squares.forEach(square => {
	  	square.removeEventListener('click', handleClick)
	  });
	}

	function enableSquares() {
		squares.forEach(square => {
      square.addEventListener('click', handleClick);
      square.innerHTML = '';
      square.style.backgroundColor = 'white';
    });
	}

	function enableEmptySquares() {
		squares.forEach(square => {
			if (square.innerHTML === '') {
				square.addEventListener('click', handleClick);
			}
		})
	}

	function updateFloatingMessage(message) {
		floatingMessage.innerHTML = message;
	}

	// disable eventListener for squares so that they do not function until the start game button has been clicked
	disableSquares();

  startButton.addEventListener('click', startGame);

  let currentPlayer;

  function startGame() {
  	if (!numberOfPlayers) {
  		updateFloatingMessage('First, could you please choose the number of players for the game?');
  		return;
  	};

    // check number of players
    if (numberOfPlayers === 1) {
    	if (playerOneName)
    		updateFloatingMessage('Welcome ' + playerOneName + ' you may choose first');
    		currentPlayer = 'human';
    } else if (numberOfPlayers === 2) {
    	if (playerOneName && playerTwoName)
    		updateFloatingMessage('Welcome ' + playerOneName + ' and ' + playerTwoName + ', ' + playerOneName + ' chooses first');
    };

    onePlayerButton.setAttribute('disabled', true);
		twoPlayerButton.setAttribute('disabled', true);

    // activate event listener for individual squares after the start game button has been clicked
    enableSquares();
    startButton.setAttribute('disabled', true);
  }

  let gameOver = false;
  let moveCount = 0;
  let currentPlayerSymbol = 'X';

  function handleClick(event) {
  	if (gameOver) {
  		return;
  	}

  	if (event.target.innerHTML !== '') {
  		return;
  	}

  	if (currentPlayer === 'human' && numberOfPlayers === 1) {
	    event.target.innerHTML = currentPlayerSymbol;
	    moveCount++
	    disableSquares(); // prevents human player from marking a square before the computer has finished its turn

	    if (checkForWinner()) {
	    	gameOver = true;
	    }

	    if (!gameOver) {
	    	currentPlayer = 'computer';
		    setTimeout(computerMove, 1000);
	  		currentPlayer = 'human';

	  		if (checkForWinner()) {
  				gameOver = true;
  			}
	  	}
  	}  else if (numberOfPlayers === 2) {
  			event.target.innerHTML = currentPlayerSymbol;
  			moveCount++;
	    	// event.target.style.backgroundColor = 'red';
	    	currentPlayerSymbol = currentPlayerSymbol === 'X' ? 'O' : 'X';
	 		  if (!checkForWinner() && moveCount === 9) {
		    	updateFloatingMessage("It's a tie!");
		    	disableSquares();
		    	gameOver = true;
		    	return;
			  };
	    	if (checkForWinner()) {
	    		gameOver = true;
	    	}
	     }
  }

  let computerSymbol = "O";

  function computerMove() {
	  if (!checkForWinner() && moveCount === 9) {
    	updateFloatingMessage("It's a tie!");
    	return;
  	}
  	//  Generate random number between 0 and 8
  	const randomIndex = Math.floor(Math.random() * 9);
  	//  Find the square element conrresponding to the random index
  	const square = squares[randomIndex];
  	//  Check if the square is empty
  	if (square.innerHTML === '') {
  		square.innerHTML = computerSymbol;
  		moveCount++
  		if (checkForWinner()) {
  			gameOver = true;
  			updateFloatingMessage('Computer has won the game!');
  		}
  	}  else {
  		computerMove();
  	}
  	enableEmptySquares();
  }

  let winningSymbol;
  let winningPlayer;

	function highlightWinningSquares(squares) {
	    squares.forEach(square => {
	        square.style.backgroundColor = 'red';
	    })
	}

  function checkForWinner() {
  	const winningCombos = [
  		[0, 1, 2],
  		[3, 4, 5],
  		[6, 7, 8],
  		[0, 3, 6],
  		[1, 4, 7],
  		[2, 5, 8],
  		[0, 4, 8],
  		[2, 4, 6],
  	];

  	for (let idx = 0; idx < winningCombos.length; idx++) {
  		const [a, b, c] = winningCombos[idx]; // => [0, 1, 2]...[2, 4, 6]

			if (squares[a].innerHTML && squares[a].innerHTML === squares[b].innerHTML && squares[a].innerHTML === squares[c].innerHTML) {
				winningSymbol = squares[a].innerHTML;

					highlightWinningSquares([squares[a], squares[b], squares[c]]);

				if (numberOfPlayers === 1) {
				  if (winningSymbol === players.playerOneSymbol) {
					  winningPlayer = playerOneName;
				  }
				} else if (numberOfPlayers === 2 && winningSymbol === players.playerTwoSymbol) {
					winningPlayer = playerTwoName;
				} else {
					winningPlayer = playerOneName;
				}

	      updateFloatingMessage('Congrats ' + winningPlayer + ', you have won the game!');
	      return true;
    	}
  	};
  	return false;
  }

  // function validatePlayerName(name) {
  // 	let tempName = name;

  // 	if (name.split(' ').filter(char => {char === ' '}).length !== 0) {
  // 		// move on to steps 2 and 3
  // 	} else {

  // 	}
  // }
});
