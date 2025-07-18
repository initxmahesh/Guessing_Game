/* 

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

function generateWinningNumber (){
    return Math.ceil(Math.random() * 100);
}

function shuffle(array) {
  let length = array.length,
    temp,
    index;
  while (length) {
    index = Math.floor(Math.random() * length--);
    temp = array[length];
    array[length] = array[index];
    array[index] = temp;
  }
  return array;
}

class Game {
  constructor(playersGuess = null, pastGuesses = []) {
    this.playersGuess = playersGuess;
    this.pastGuesses = pastGuesses;
    this.winningNumber = generateWinningNumber();
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }

  isLower() {
    if (this.playersGuess < this.winningNumber) {
      return true;
    } else {
      return false;
    }
  }

  playersGuessSubmission(num) {
    if (num < 1 || num > 100 || typeof num !== "number") {
      throw `That is an invalid guess.`;
    } else {
      this.playersGuess = num;
    }
    return this.checkGuess();
  }

  checkGuess() {
    if (this.playersGuess === this.winningNumber) return `You Win!`;
    else if (this.pastGuesses.includes(this.playersGuess))
      return `You have already guessed that number.`;
    else this.pastGuesses.push(this.playersGuess);

    if (this.pastGuesses.length === 5) return `You Lose.`;

    let guesslvl = Math.abs(this.playersGuess - this.winningNumber);
    if (guesslvl < 10) return `You're burning up!`;
    if (guesslvl < 25) return `You're lukewarm.`;
    if (guesslvl < 50) return `You're a bit chilly.`;
    if (guesslvl < 100) return `You're ice cold!`;
  }

  provideHint() {
    let hintArray = [];
    hintArray.push(this.winningNumber);
    hintArray.push(generateWinningNumber());
    hintArray.push(generateWinningNumber());

    return shuffle(hintArray);
  }
}

let newGame = function () {
  return new Game();
};
