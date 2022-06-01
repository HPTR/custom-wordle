import "./styles.scss";
import { words, allWords } from "./data/data.js";

const gameOptions = document.querySelector('.game-options-container');
const gameContainer = document.querySelector('.game-container');
const endgameContainer = document.querySelector('.endgame-container');
const endgameScreen = document.querySelector('.endgame-screen');
const playArea = document.querySelector('.play-area');
const playButton = document.querySelector('.game-options__play-button');
const numOfLetters = document.querySelector('.game-options__select--number-of-letters');
const numOfGuesses = document.querySelector('.game-options__select--number-of-guesses');
const allLetters = document.querySelectorAll('.keyboard__button--letter');
const deleteButton = document.querySelector('.keyboard__button--delete');
const enterButton = document.querySelector('.keyboard__button--enter');
let solution;

const generateNewSolution = (wordLength) => {
    const wordArray = words[wordLength];
    const randomIndex = Math.floor(Math.random() * wordArray.length)
    return solution = wordArray[randomIndex];
}

const setVisibleContainer = (container) => {

    switch(container) {
        case 'game':
            gameContainer.hidden = false;
            gameOptions.hidden = true;
            endgameContainer.hidden = true;
            break;
        case 'options':
            gameContainer.hidden = true;
            gameOptions.hidden = false;
            endgameContainer.hidden = true;            
            break;
        case 'endgame':
            gameContainer.hidden = true;
            gameOptions.hidden = true;
            endgameContainer.hidden = false;            
            break;
        default:
            console.log('Invalid container parameter');
    }
}

const generateRow = (numberOfLetters) => {
    const guessCell = `<div class="play-area__cell empty"></div>`
    let rowOfCells = ``;

    for (let i = 0; i < numberOfLetters; i++) {
        rowOfCells += guessCell;
    }

    const guessElement = (`<div class="play-area__guess incomplete" data-letters="">` + rowOfCells + `</div>`);
    return guessElement;
}

const createGameGrid = (numberOfLetters, numberOfGuesses) => {
    const guessRow = generateRow(numberOfLetters);
    let guesses = ``;

    for (let i = 0; i < numberOfGuesses; i++) {
        guesses += guessRow;
    };

    return guesses;
}

const generatePlayArea = () => {
//GENERATION SHOULD BE BOUND ELSEWHERE???
    generateNewSolution(numOfLetters.value);
    console.log(allWords.includes(solution));
    console.log(solution);

    //This if statement might be unnecessary later on but good for now
    if (gameContainer.hidden.toString() === 'false') {
        playArea.innerHTML = "";
        toggleContainerVisibility('game');
        return;
    }

    playArea.insertAdjacentHTML('beforeend', createGameGrid());

    toggleContainerVisibility('game');
}

const handleLetterPress = (event) => {
    const activeGuess = getActiveGuess();
    const activeCell = activeGuess.querySelector('.empty');

    if(activeGuess.dataset.letters.length === activeGuess.children.length) {
        return;
    }

    activeCell.innerText = event.target.innerText;
    activeCell.classList.remove('empty');
    activeGuess.dataset.letters += event.target.innerText;
}

const handleDeletePress = (event) => {
    const activeGuess = getActiveGuess();

    for (let i = activeGuess.children.length - 1; i > -1 ; i--) {
        let currentCell = activeGuess.children[i];

        if (activeGuess.children[i].innerText !== "") {
            console.log('pink');
            currentCell.innerText = "";
            currentCell.classList.add('empty');
            activeGuess.dataset.letters = activeGuess.dataset.letters.slice(0, -1); 
            return
        }
    }
}

const handleEnterPress = (event) => {
    const activeGuess = getActiveGuess();
    const guess = activeGuess.dataset.letters;

    if (guess.length < numOfLetters.value) {
        console.log('Not enough letters');
        return
    };

    let validatedWord;

    allWords.includes(guess.toLowerCase()) ? validatedWord = guess : validatedWord = undefined;

    console.log(validatedWord);


    if (validatedWord) {
        const resultArr = computeGuess(validatedWord.toLowerCase());

        resultArr.forEach((colour, index) => {
            activeGuess.children[index].style.backgroundColor = colour;
            activeGuess.children[index].style.color = 'white';
        })
        activeGuess.classList.remove('incomplete');

        if (resultArr.every(colour => colour === 'green')) {
            console.log('winner');
            endGame(true);
        } else if (!activeGuess.nextSibling) {
            console.log('loser');
            endGame(false);
        }
    }
    
}

const endGame = (isVictory) => {
    toggleContainerVisibility('game');
    if (isVictory) {
        

    }
}

const computeGuess = (guess) => {
    const guessArr = guess.split('');
    const solutionArr = solution.split('');

    const indexArr = guessArr.map((guessLetter, guessIndex) => {
        if (guessIndex === solutionArr.indexOf(guessLetter)) {
            solutionArr[solutionArr.indexOf(guessLetter)] = '';
            return ('green');
        } else if (solutionArr.includes(guessLetter)) {
            solutionArr[solutionArr.indexOf(guessLetter)] = '';
            return ('yellow');
        } else {
            solutionArr[solutionArr.indexOf(guessLetter)] = '';
            return ('black');
        }
    })
    return indexArr;
}

const getActiveGuess = () => {
    return document.querySelector('.incomplete');
}

playButton.addEventListener('click', generatePlayArea);
allLetters.forEach(letter => letter.addEventListener('click', handleLetterPress));
deleteButton.addEventListener('click', handleDeletePress);
enterButton.addEventListener('click', handleEnterPress);