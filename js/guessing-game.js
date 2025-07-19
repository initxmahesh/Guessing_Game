/* 

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

function generateWinningNumber() {
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

document.addEventListener("DOMContentLoaded", () => {
  game = new Game();
  updateDisplay();
});

const guessInput = document.getElementById("guess-input");
const playBtn = document.getElementById("play-btn");
const resetBtn = document.getElementById("reset-btn");
const hintBtn = document.getElementById("hint-btn");
const feedback = document.getElementById("feedback");
const attempts = document.getElementById("attempts");
const pastGuesses = document.getElementById("past-guesses");
const slots = [
  document.getElementById("slot1"),
  document.getElementById("slot2"),
  document.getElementById("slot3"),
];

function updateDisplay() {
  attempts.textContent = `${game.pastGuesses.length}/5`;
  pastGuesses.textContent =
    game.pastGuesses.length > 0 ? game.pastGuesses.join(", ") : "None";

  if (game.pastGuesses.length >= 5) {
    playBtn.disabled = true;
    hintBtn.disabled = true;
  }
}

function resetGame() {
  game = new Game();
  guessInput.value = "";
  feedback.textContent =
    "🙏नमस्ते🙏, १ देखि १०० सम्मको कुनै एक अंक छान्नुहोस्!";
  feedback.className = "feedback";
  playBtn.disabled = false;
  hintBtn.disabled = false;
  slots.forEach((slot) => (slot.textContent = "?"));
  updateDisplay();
}

function spinSlots() {
  if (game.pastGuesses.length < 4) {
    feedback.textContent = "Hint is available at the end only!";
    return;
  }
  slots.forEach((slot) => {
    slot.classList.add("spinning");
    slot.textContent = "...";
  });

  setTimeout(() => {
    const hints = game.provideHint();
    slots.forEach((slot, index) => {
      slot.classList.remove("spinning");
      slot.textContent = hints[index];
    });
  }, 500);
}

function makeGuess() {
  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > 100) {
    feedback.textContent = "कृपया, सहि अंक हाल्नुहोस् (१-१००)";
    return;
  }

  try {
    const result = game.playersGuessSubmission(guess);
    feedback.textContent = result;

    if (result === "You Win!") {
      feedback.className = "feedback win";
      playBtn.disabled = true;
      hintBtn.disabled = true;
    } else if (result === "You Lose.") {
      feedback.className = "feedback lose";
      feedback.textContent = `You Lose! The number was ${game.winningNumber}`;
    } else if (result.includes("burning")) {
      feedback.className = "feedback hot";
    } else {
      feedback.className = "feedback";
    }

    updateDisplay();
    guessInput.value = "";
  } catch (error) {
    feedback.textContent = error;
  }
}
playBtn.addEventListener("click", makeGuess);
resetBtn.addEventListener("click", resetGame);
hintBtn.addEventListener("click", spinSlots);

guessInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    makeGuess();
  }
});
updateDisplay();
