const prompt = require("readline-sync");
const wordBank = require("./word-bank.json");

//Display
const header = `By: Elijah Brown`;


const cleanConsole = "\u001b[H\u001b[2J\u001b[3J";
const clearScreen = "\u001B[2J\u001B[0;0f";
const lettersOnly = /[a-z]/gi;
let randomWordIndex, randomWord = '', guessedLetter = '', checkLetter, letterUsed = '', trys = 6, correctCharacters = [], incorrectCharacters = [];

// State
let gameResults = {
  "Rounds Played": 1,
  "Wins": 0, 
  "Losses": 0
};

// Starts with a fresh console
console.log(cleanConsole);

// function generates new random word
 wordGenerator = () => {
  // Gets a random number between 0 and length of the array and sets it to the variable
  randomWordIndex = Math.floor(Math.random(wordBank) * (wordBank.length - 0) + 0);

  // Uses the randomWordIndex to set the actual word from the array to the variable 
  randomWord = wordBank[randomWordIndex].toUpperCase();
}
wordGenerator();


// The correctCharacters Array length has to be set after the wordGenerator() because otherwise the randomWord has not been initialized yet and will be a length of 0
correctCharacters = Array(randomWord.length).fill('__');



console.log(header);


// Greeting when logging in for the First Time
console.log(`Welcome to Hangman!\nPress CTRL-C to stop\n`,

`\nBegin by typing your first guess below...\n`);

guess = () => {  
    guessedLetter = prompt.question("\nChoose a letter: ").toUpperCase();
};

inputValidation = () => {
 if(!lettersOnly.test(guessedLetter) || guessedLetter.length > 1) {
   
   if(guessedLetter.length > 1) {
     guessedLetter = prompt.question("\nOnly \x1b[31m'ONE' \x1b[37mletter is accepted, Please guess a single letter: ").toUpperCase()
     inputValidation();
   } 
   
   else if(!lettersOnly.test(guessedLetter)) {
     guessedLetter = prompt.question("\nOnly \x1b[33m'Alphabetical' \x1b[37mCharacters are accepted, Please guess a letter: ").toUpperCase();
     inputValidation();
   } 
 }
}

// An Round Over function to keep with the practice of DRY: Do Not Repeat yourself
roundOver = () => {
    // This resets the 'state' so the game continues to play only until the User Presses Ctrl-C to exit Node
    trys = 6;
    incorrectCharacters = []; 
    
    // Increments the Total amount of Rounds played in the gameResults Object
    gameResults["Rounds Played"]++;
    
    // Invokes wordGenerator to pick a new random word for the next round
    wordGenerator();
    
    // The correctCharacters Array length has to be set after the wordGenerator() picks the next random word because the length of the word might be different
    correctCharacters = Array(randomWord.length).fill('__');
    
   }


// Start of game loop | Game counts down from 6 and once it gets to zero there is either a win or loss and the game restarts.
while(trys > 0) {

    guess()
    
  
  // Invokes function to check if the user input an invalid character or if the user input more than one character, prompts user to re-enter a valid letter
  inputValidation();
  
  // checkLetter variable checks if the letter is in the word
  checkLetter = randomWord.split('').includes(guessedLetter);
  
  // Checks if letter has already been guessed
  letterUsed = incorrectCharacters.includes(guessedLetter);
  
  // if checkLetter is true and the letter is not already been added to correctCharacters, log the letter was found
  if(checkLetter && !correctCharacters.includes(guessedLetter)) { 
    console.log(clearScreen);
    console.log(header);
    
    gallows(trys);
    // If guessed letter is found, gets "all" the indexs of letter in randomWord
    const indexOfAll = randomWord.split('').map((letter, idx) => letter === guessedLetter ? idx : null).filter(idx => idx !== null)  
    
    // maps over indexOfAll and pushes the guessedLetter to each index in which it was found
    indexOfAll.map(indexNum => correctCharacters.splice(indexNum, 1, guessedLetter))
   
    
    console.log(` \x1b[32m${correctCharacters.join(' ')}\x1b[37m\n`,
    `Incorrect Guesses: \x1b[36m${incorrectCharacters.join(' ')}\x1b[37m\n`,
    `\nThe letter \x1b[32m'${guessedLetter}' \x1b[37mwas found!\n`,
    `\x1b[37m\nYou have \x1b[33m${trys} \x1b[37mguesses left\n`);
} 
    // if correctCharacters array already has the guessed letter, display, has already been found.
  else if(correctCharacters.includes(guessedLetter)) {
    console.log(clearScreen);
    console.log(header);
    gallows(trys);
    console.log(` \x1b[32m${correctCharacters.join(' ')}\x1b[37m`);
    console.log(`\nThe letter \x1b[32m'${guessedLetter}' \x1b[37mhas already been found!\n`);
    console.log(`\x1b[37m\nYou have \x1b[33m${trys} \x1b[37mguesses left\n`);
    
  } else {
    console.log(clearScreen);
    console.log(header);

    // THIS IS WHERE COUNT DECREMENTS FOR A WRONG GUESS!!!
    trys--;
    
    gallows(trys);
    console.log(` \x1b[32m${correctCharacters.join(' ')}\x1b[37m`);
    // A wrong guess pushes the letter to the incorrectCharacters array
    incorrectCharacters.push(guessedLetter);
    console.log(`\nThe letter \x1b[31m'${guessedLetter}' \x1b[37mwas 'NOT' found!\n`); 
    console.log(`Incorrect Guesses: \x1b[36m${incorrectCharacters.join(' ')}\x1b[37m\n`);
    

    if(letterUsed) {
      // This increments the trys so the trys does not decrement for the same incorrect letter
      trys++
      
      // Informs the user that they have already guessed that particular letter 
      console.log(`\x1b[33m\nYou have already guessed the letter \x1b[31m\'${guessedLetter}'\x1b[33m\.\nA repeat guess will not trys against you but, it also serves no purpose.\nPlease guess a new letter below.\n`);
      // if the letter has not already been guessed and is incorrect the trys WILL NOT decrement
      console.log(`\x1b[37m\nYou have \x1b[33m${trys} \x1b[37mguesses left\n`);
    } else {
      
      // if there is only 1 guess left changes guesses plural to singular to be grammatically correct
      if(trys === 2) {
        // SINGULAR
        // if the letter has not already been guessed and is incorrect the trys will decrement
        console.log(`\nYou have \x1b[33m${trys} \x1b[37mguess left\n`);
      } else {
        // PLURAL
        console.log(`\nYou have \x1b[33m${trys} \x1b[37mguesses left\n`);
      }
    }
  }

  

  // *** WINNING ROUND ***
  if(correctCharacters.join('') === randomWord) {
    console.log(`\n\nYou guessed the correct word: \x1b[32m${randomWord} \x1b[37m\n\n`);
    gameResults.Wins++;

     // Prints the Key Value pairs for Total Rounds, Wins and Losses at the end of the round
     Array.from(Object.keys(gameResults)).forEach(key => {
      console.log(`${key}: ${gameResults[key]}`);    
    });

    // Informs user if they want a rematch to just keep playing or the keys they need to press to quit
    console.log(`\n\x1b[36mWant to play another round? Continue to keep playing or press CTRL-C to quit!\x1b[37m\n`);

    roundOver();
  }
  
  // *** LOSING ROUND ***
  // Once all the guesses have run out and the user has not been able to solve the answer, we console log the answer here!
  if(trys === 0) {
    console.log(`\nThe answer was \x1b[32m"${randomWord.toUpperCase()}" \x1b[37m\n\n`);
    gameResults.Losses++;
    
    // Prints the Key Value pairs for Total Rounds, Wins and Losses at the end of the round
    Array.from(Object.keys(gameResults)).forEach(key => {
      console.log(`${key}: ${gameResults[key]}`);    
    });
    
    // Informs user if they want a rematch to just keep playing or the keys they need to press to quit
    console.log(`\n\x1b[36mWant a rematch? Continue to keep playing or press CTRL-C to quit!\x1b[37m\n`);
    
    roundOver();
  }
}


// *** START OF HANGMAN GRAPHIC ***
function gallows(trys) {
  // If statement, checks if character has already been guessed and if so increments trys in graphic to match the amount of guesses left
  if(letterUsed) trys++;

  switch(trys) {
    case 5: console.log(`\x1b[32m___________
| /       |
|/        |
|        💀
|        
|        
|        
|
|     
-----------------
\x1b[37m`); 
    break;

    case 4: console.log(`\x1b[32m___________
| /       |
|/        |
|        💀
|         \x1b[37m|\x1b[32m
|         \x1b[37m|\x1b[32m 
|       
|
| 
-----------------
\x1b[37m`);
      
    break;

    case 3: console.log(`\x1b[32m___________
| /       |
|/        |
|        💀
|        \x1b[37m\\|\x1b[32m
|         \x1b[37m|\x1b[32m
|        
|
| 
-----------------
        \x1b[37m`);

    break;

    case 2: console.log(`\x1b[32m___________
| /       |
|/        |
|        💀
|        \x1b[37m\\|/\x1b[32m
|         \x1b[37m|\x1b[32m
|        
|
|  
-----------------
          \x1b[37m`);
    break;

    case 1: console.log(`\x1b[32m___________
| /       |
|/        |
|        💀
|        \x1b[37m\\|/\x1b[32m
|         \x1b[37m|\x1b[32m
|        \x1b[37m/\x1b[32m
|
|    
-----------------
          \x1b[37m`);
    break;

    case 0: console.log(`\x1b[32m___________
| /       |
|/        |
|        💀
|        \x1b[37m\\|/\x1b[32m
|         \x1b[37m|\x1b[32m
|        \x1b[37m/ \\\x1b[32m
|
|     
-----------------
          \x1b[37m`);
    break;
    default: console.log(`\x1b[32m___________
| /       |
|/        |
|        
|        
|        
|        
|
|     
-----------------
            \x1b[37m`); 
  }
}