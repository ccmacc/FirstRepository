/* Blackjack game
Clint McCarthy
*/

//Card variables
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
let values = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight',
  'Nine', 'Ten', 'Jack', 'Queen', 'King'
];

//DOM variables
let textArea = document.getElementById("text-area");
let newGameButton = document.getElementById("new-game-button");
let hitButton = document.getElementById("hit-button");
let stayButton = document.getElementById("stay-button");


//Game variables
let gameStarted = false,
  gameOver = false,
  playerWon = false,
  blackjack = false,
  dealerCards = [],
  playerCards = [],
  playerScore = 0,
  dealerScore = 0,
  deck = [];

//Hide buttons when game starts
hitButton.style.display = "none";
stayButton.style.display = "none";
showStatus();

//New game event listener
newGameButton.addEventListener("click", function() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  //Show hit and stay button oncegame starts
  newGameButton.style.display = "none";
  hitButton.style.display = "inline";
  stayButton.style.display = "inline";
  checkForEndOfGame();
  showStatus();
});

//Hit button event listener
hitButton.addEventListener('click', function() {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

//Stay button event listener
stayButton.addEventListener('click', function() {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

//Build deck of cards
function createDeck() {
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx]
      };
      //Add card object to deck  
      deck.push(card);
    }
  }
  return deck;
}

//Shuffle cards
function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let temp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = temp;

  }
}

//Getter for suit and value of cards
function getCardString(card) {
  return card.value + ' of ' + card.suit;

}

//Draw next card from the deck
function getNextCard() {
  return deck.shift();
}

//Assign numberic vlaues to card values
function getCardNumericValue(card) {
  switch (card.value) {
    case 'Ace':
      return 11;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

//Calculate score of hand
function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);

  }

  return score;
}

//Update player and dealer scores
function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
  for (let i = 0; i < playerCards.length; i++) {
    if (playerCards[i].value === 'Ace' && playerScore > 21) {
      playerScore -= 10;
    }
  }
}

//End of game check including logic to check for Blackjack
function checkForEndOfGame() {
  updateScores();

  if (gameOver) {
    //let dealer take cards
    while (dealerScore < playerScore && playerScore <= 21 && dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if (playerScore === 21) {
    playerWon = true;
    gameOver = true;
  }

  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
  } else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
  } else if (gameOver) {

    if (playerScore > dealerScore) {
      playerWon = true;
    } else if (dealerScore === playerScore) {
      playerWon = false;
    } else {
      playerWon = false;
    }
  }
}

//Displays the current status of the game 
function showStatus() {
  if (!gameStarted) {
    textArea.innerText = 'Welcome to Blackjack!';
    return;
  }

  let dealerCardString = '';
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + '\n';

  }

  let playerCardString = '';
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + '\n';

  }

  updateScores();

  textArea.innerText =
    'Dealer has:\n' +
    dealerCardString +
    '(score: ' + dealerScore + ')\n\n' +

    'Player has:\n' +
    playerCardString +
    '(score: ' + playerScore + ')\n\n';

  if (gameOver) {
    if (playerWon && playerCards.length === 2 && playerScore === 21) {
      textArea.innerText += "BLACKJACK!!!!";
    } else if (playerWon) {
      textArea.innerText += "YOU WIN!";
    } else {
      textArea.innerText += "DEALER WINS";
    }
    newGameButton.style.display = "inline";
    hitButton.style.display = "none";
    stayButton.style.display = "none";
  }
}