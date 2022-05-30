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

const toggleGameContainerVisibility = (event) => {
    const state = gameContainer.hidden.toString();
    state === 'true' ? gameContainer.hidden = false : gameContainer.hidden = true;
    console.log('hi');
    return;
}

const createGuessRow = () => {
    //Add catch for unchanged numofLetters box
    
    const tileCount = numOfLetters.value;
    let rowOfCells = '';
    const guessCell = `<div class="cell"></div>`


    for (let i = 0; i < tileCount; i++) {
        rowOfCells += guessCell;
    }

    const guessElement = (`<div class="guess">` + rowOfCells + `</div>`);
    return guessElement;
}

const createGameGrid = () => {
    //Add catch to clear if necessary?

    let guesses = '';
    const guessRow = createGuessRow();

    for (let i = 0; i < numOfGuesses.value; i++) {
        guesses += guessRow;
    }
    
    return guesses;
}

const generatePlayArea = (event) => {
    //This if statement might be unnecessary later on but good for now
    if (gameContainer.hidden.toString() === 'false') {
        playArea.innerHTML = "";
        toggleGameContainerVisibility();
        return;
    }

    playArea.insertAdjacentHTML('beforeend', createGameGrid());

    toggleGameContainerVisibility();
}

const manageCurrentActiveCell = (event) => {

}

const handleLetterPress = (event) => {

}

playButton.addEventListener('click', generatePlayArea)