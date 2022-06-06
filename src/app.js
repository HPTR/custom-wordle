import "./styles.scss";
import { words, allWords } from "./data/data.js";

const gameOptions = document.querySelector('.game-options-container');
const gameContainer = document.querySelector('.game-container');
const endgameContainer = document.querySelector('.endgame-container');
const endgameScreen = document.querySelector('.endgame-screen');
const playArea = document.querySelector('.play-area');
const playButton = document.querySelector('.game-options__button');
const numOfLetters = document.querySelector('.game-options__select--number-of-letters');
const numOfGuesses = document.querySelector('.game-options__select--number-of-guesses');
const allLetters = document.querySelectorAll('.keyboard__button--letter');
const deleteButton = document.querySelector('.keyboard__button--delete');
const enterButton = document.querySelector('.keyboard__button--enter');
const playAgain = document.querySelector('.endgame-buttons__button--replay');
const changeSettings = document.querySelector('.endgame-buttons__button--settings');
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

const handlePlayPress = () => {
    const numberOfGuesses = numOfGuesses.value;
    const numberOfLetters = numOfLetters.value;

    if (numberOfGuesses === 'Select' || numberOfLetters === 'Select') {
        console.log('please choose values');
        return;
    }

    playArea.innerHTML = "";
    allLetters.forEach(letter => {
        letter.classList.remove('color-green');
        letter.classList.remove('color-yellow');
        letter.classList.remove('color-black');
        letter.style.color = 'black';
    });
    generateNewSolution(numberOfLetters);
    console.log(allWords.includes(solution));
    console.log(solution);

    playArea.insertAdjacentHTML('beforeend', createGameGrid(numberOfLetters, numberOfGuesses));

    setVisibleContainer('game');
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
            activeGuess.children[index].classList.add(`color-${colour}`);
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

    endgameScreen.innerHTML = "";
    let solutionCells;


    if (isVictory) {

        solutionCells = solution.split('').map(letter => `<div class="endgame-screen__cell color-green" style="color:white">${letter.toUpperCase()}</div>`);
        
        endgameScreen.insertAdjacentHTML('beforeend', `
            <h2 class="endgame-screen__status">You Got It!</h2>
            <p class="endgame-screen__text">The answer was:</p>
            <div class="endgame-screen__answer">${solutionCells.join('')}</div>
            <p class="endgame-screen__text">Select below if you would like to play again with the same rules or with new ones</p>
        `);


    } else {

        solutionCells = solution.split('').map(letter => `<div class="endgame-screen__cell color-black" style="color:white">${letter.toUpperCase()}</div>`);

        endgameScreen.insertAdjacentHTML('beforeend', `
        <h2 class="endgame-screen__status">Unlucky!</h2>
        <p class="endgame-screen__text">The answer was:</p>
        <div class="endgame-screen__answer">${solutionCells.join('')}</div>
        <p class="endgame-screen__text">Select below if you would like to play again with the same rules or with new ones</p>
    `);
    }

    setVisibleContainer('endgame')
}

const computeGuess = (guess) => {
    const guessArr = guess.split('');
    const solutionArr = solution.split('');
    let newArr = guessArr.map(letter => letter = '');

    guessArr.forEach((guessLetter, guessIndex) => {
        document.querySelector(`.${guessLetter.toLowerCase()}`).style.color = 'white';
        if (guessIndex === solutionArr.indexOf(guessLetter)) {
            solutionArr[solutionArr.indexOf(guessLetter)] = '';
            document.querySelector(`.${guessLetter.toLowerCase()}`).classList.remove(`color-yellow`);
            document.querySelector(`.${guessLetter.toLowerCase()}`).classList.add(`color-green`);
            newArr[guessIndex] = 'green';
        };
    });

    guessArr.forEach((guessLetter, guessIndex) => {
        document.querySelector(`.${guessLetter.toLowerCase()}`).style.color = 'white';
        if (solutionArr.includes(guessLetter)) {
            solutionArr[solutionArr.indexOf(guessLetter)] = '';
            if (newArr[guessIndex] === '') {
                if (!document.querySelector(`.${guessLetter.toLowerCase()}`).classList.contains('color-green')) {
                    document.querySelector(`.${guessLetter.toLowerCase()}`).classList.add(`color-yellow`);
                }
                newArr[guessIndex] = 'yellow';
            }
        };
    });

    guessArr.forEach((guessLetter, guessIndex) => {
        document.querySelector(`.${guessLetter.toLowerCase()}`).style.color = 'white';
        if (!solutionArr.includes(guessLetter)) {
            if (newArr[guessIndex] === '') {
                if (!document.querySelector(`.${guessLetter.toLowerCase()}`).classList.contains('color-green') && !document.querySelector(`.${guessLetter.toLowerCase()}`).classList.contains('color-yellow')) {
                    document.querySelector(`.${guessLetter.toLowerCase()}`).classList.add(`color-black`);
                }                
                newArr[guessIndex] = 'black';
            }
        };
    });

    return newArr;
}

const getActiveGuess = () => {
    return document.querySelector('.incomplete');
}

const handleChangeSettings = () => {
    setVisibleContainer('options');
}

playButton.addEventListener('click', handlePlayPress);
allLetters.forEach(letter => letter.addEventListener('click', handleLetterPress));
deleteButton.addEventListener('click', handleDeletePress);
enterButton.addEventListener('click', handleEnterPress);
playAgain.addEventListener('click', handlePlayPress);
changeSettings.addEventListener('click', handleChangeSettings);