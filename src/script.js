const randomWords = require('random-words');

const gameOptions = document.querySelector('.game-options');
const playArea = document.querySelector('.game-container');
const playButton = document.querySelector('.play-button')


// Variation drops off significantly at 11 characters
const generateWordOfLength = (length) => {
    let isDesiredLength = false;
    let currentWord = randomWords();
    while(!isDesiredLength) {
        currentWord = randomWords();
        if (currentWord.length === length) {
            isDesiredLength = true;
        }
    }
    return currentWord;
}

const generateWordGrid = (numOfLetters, numOfGuesses) => {
    console.log('go');
    playArea.style.display = block;
    return;
}

playButton.addEventListener('click', generateWordGrid(1,1))