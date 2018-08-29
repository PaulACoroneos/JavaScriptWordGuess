// array storing all possible words in the game
var gamesArrPermanent = ["final fantasy","dragon quest","call of duty","medal of honor","halo","gears of war","mario","the legend of zelda","pokemon","pikimin","sonic the hedgehog","grand theft auto","fallout","crash bandicoot"];
var gamesArr = [];
gamesArr = gamesArrPermanent;   //make a copy to local arr. This is so user could replay game over and ove

//initialize game variables
var wins=0;
var losses=0;
var totalGuesses=10; //how many guesses user is allowed
var gameWord = [];  //var that holds the word selected for this game
var guessArr = [];   //arr to hold guesses guessed
var displayArr = [];    //arr that is displayed on screen
var skip = 0;   //error check skip var
var instances = [];  //store locations of guess letter in word
var charset = "abcdefghijklmnopqrstuvwxyz"; //for error checking
var lettersLeft = 0; //holds how many letters are left to guess

//vars to hold location on page we will inject new content
var displayWins = document.getElementById("wins");
var displayLosses = document.getElementById("losses");
var displayGuesses = document.getElementById("guesses");
var wordToGuess = document.getElementById("wordToGuess");   //store word being guessed
var lettersUsed = document.getElementById("lettersUsed");   //store letters guessed so far

function updateDisplay() {
    //display values to user
    displayWins.textContent = "Wins: " + wins;
    displayLosses.textContent = "Losses: " + losses;
    displayGuesses.textContent = "Guesses Left: " + totalGuesses;
    lettersUsed.textContent = "Letters guessed so far: " + guessArr;
    wordToGuess.textContent = displayArr;
}

//function to pick new word from the list
function generateNewWord () {

    guessArr = [];  //clear array
    displayArr = [];
    totalGuesses = 10;  //reset guess counter

    if (gamesArr.length ===0)   //did we run out of words to guess?
    {
        alert("I ran out of words! But I will cycle through them again.");
        gamesArr = gamesArrPermanent;   //refill array from master copy
    }
    var rando = Math.floor(Math.random()*gamesArr.length);
    gameWord = gamesArr[rando]; //pick initial random word
    gamesArr.splice(gamesArr.indexOf(gameWord), 1); //remove word from list of possible words
    for(var i=0;i<gameWord.length;i++)
        if(charset.indexOf(gameWord[i]) >-1)  //if not a whitespace (valid english letter)
        {
            displayArr.push("-");   //push a dash into the string array
            lettersLeft++;   //increment lettersLeft counter
        }
        else
            displayArr.push("");

    updateDisplay();
    return [gameWord,displayArr]; //return word to guess and "dashed version"
}


//initialize game
[gameWord,displayArr] = generateNewWord(); //use destructuring assignments (wow)

console.log(gameWord);
console.log(displayArr);

//define game loop
document.onkeyup = function(event) {
    
    var guess = event.key;    //store user letter guess
    skip = 1;   //assume we are okay initially

    //error checking block + input conditioning
    if(charset.indexOf(guess) === -1)  //is the entry valid?
    {
        skip=0;
        alert("Please select an english character");
    }
    else if(guessArr.indexOf(guess) !== -1)    //did the user already guess the entered character?
    {
        skip=0;
        alert("You have already guessed " + guess + ". Please guess another character."); 
    }
    else //user guessed something new that wasn't guessed before
    {
        guess.toLowerCase();
        guessArr.push(guess); //add user guess to array of used guesses
        guesses--;  //decrement guess counter
    }
    //end error checkng block +input conditioning
    if(skip){
        if(gameWord.indexOf(guess) > -1 ) // is user guessed character in the word?
        {
            console.log("got here guessed it");
            //find all instances of user guessed letter in word
            for(var i=0;i<gameWord.length;i++)
                if(gameWord[i] === guess)
                {
                    instances.push(i);  //array of locations letter exist
                    lettersLeft--;  //decrement number of letters left to guess
                }
            //now replace dashes with location of these letters
            for(var i=0;i<instances.length;i++)
                displayArr[instances[i]] = guess;   //replace dash with its letter

            instances = []; //clear array
            updateDisplay();
        }
        else if (gamesArr.indexOf(guess) === -1 && totalGuesses ===1) //did we fail to find a letter and run out of guesses
        {
            console.log("got here didnt guess and outta guess");
            losses++;
            alert("Sorry the word you were trying to guess was "+ gameWord);    //display game word
            resetGame();
            updateDisplay();
        }
        else{   //didn't guess but have guesses left
            console.log("didnt guess but have guesses left")
            totalGuesses--;
            updateDisplay();
        }

        if(lettersLeft === 0)   //did we guess the word?!
        {
            alert("Nice job! The word was "+ gameWord);
            wins++;
            generateNewWord();
        }

    }

}