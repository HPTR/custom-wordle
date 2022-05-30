import "./styles.scss";
const randomWords = require('random-words')

const gameOptions = document.querySelector('.game-options');
const gameContainer = document.querySelector('.game-container');
const playArea = document.querySelector('.play-area');
const playButton = document.querySelector('.play-button');
const numOfLetters = document.querySelector('.number-of-letters');
const numOfGuesses = document.querySelector('.number-of-guesses');

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

const generateWordGrid = (event) => {
    const state = playArea.hidden.toString();
    console.log('fire');
    state === 'true' ? playArea.hidden = false : playArea.hidden = true;
    event.stopPropagation();
    event.preventDefault();
}

const addElement = (event) => {
    gameOptions.append('helloooo')
}

playButton.addEventListener("click", generateWordGrid);
playButton.addEventListener('click', addElement)