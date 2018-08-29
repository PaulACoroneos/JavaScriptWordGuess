// array storing all possible words in the game
var gamesArrPermanent = ["final fantasy","dragon quest","call of duty","medal of honor","halo","gears of war","mario","the legend of zelda","pokemon","pikimin","sonic the hedgehog","grand theft auto","fallout","crash bandicoot"];
var gamesArr = [];
gamesArr.push(gamesArrPermanent);   //make a copy to local arr. This is so user could replay game over and over

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

//function to pick new word from the list
function generateNewWord () {
    if (gamesArr.length ===0)   //did we run out of words to guess?
    {
        alert("I ran out of words! But I will cycle through them again.");
        gamesArr.push(gamesArrPermanent);   //refill array from master copy
    }
    gameWord.push(gamesArr[Math.floor(Math.random*gamesArr.length)+1]); //pick initial random word
    gamesArr.splice(gamesArr.indexOf(gameWord), 1); //remove word from list of possible words
    for(var i=0;i<gameWord.length;i++)
        if(gameWord[i] !== "")  //if not a whitespace
        {
            displayArr.push("-");   //push a dash into the string array
            lettersLeft++;   //increment lettersLeft counter
        }
}

//function to restart game
function resetGame () {

    guessArr = [];  //clear array
    totalGuesses = 10;  //reset guess counter

    //display values to user
    displayWins.textContent = "Wins: " + wins;
    displayLosses.textContent = "Losses: " + losses;
    displayGuesses.textContent = "Guesses Left: " + totalGuesses;
    lettersUsed.textContent = "Letters guessed so far: " + guessArr;
    wordToGuess.textContent = displayArr;

    generateNewWord();

}

//initialize game
resetGame();

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

        if(gamesArr.indexOf(guess) > -1 ) // is user guessed character in the word?
        {
            //find all instances of user guessed letter in word
            for(var i=0;i<gamesArr.length;i++)
                if(gameWord[i] === guess)
                {
                    instances.push(i);  //array of locations letter exist
                    lettersLeft--;  //decrement number of letters left to guess
                }
            
            //now replace dashes with location of these letters
            for(var i=0;i<instances.length;i++)
                displayArr[instances[i]] = guess;   //replace dash with its letter

            instances = []; //clear array
        }
        else if (gamesArr.indexOf(guess) === -1 && totalGuesses ===1) //did we fail to find a letter and run out of guesses
        {
            losses++;
            alert("Sorry the word you were trying to guess was "+ gameWord);    //display game word
            resetGame();
        }
        else{   //didn't guess but have guesses left
            totalGuesses--;
        }

        if(lettersLeft === 0)   //did we guess the word?!
        {
            alert("Nice job! The word was "+ gameWord);
            resetGame();
        }

    }

}