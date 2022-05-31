import "./styles.scss";
const randomWord = require('random-word-by-length');


const gameOptions = document.querySelector('.game-options');
const gameContainer = document.querySelector('.game-container');
const playArea = document.querySelector('.play-area');
const playButton = document.querySelector('.play-button');
const numOfLetters = document.querySelector('.number-of-letters');
const numOfGuesses = document.querySelector('.number-of-guesses');
const allLetters = document.querySelectorAll('.keyboard__button--letter');
const deleteButton = document.querySelector('.keyboard__button--delete');
const enterButton = document.querySelector('.keyboard__button--enter');
let solution;

const generateNewSolution = (length) => {
    return solution = randomWord(length);
}
//choose visible container?
const toggleGameContainerVisibility = () => {
    const state = gameContainer.hidden.toString();
    state === 'true' ? gameContainer.hidden = false : gameContainer.hidden = true;
    console.log('hi');
    return;
}

const createGuessRow = () => {
    //Add catch for unchanged numofLetters box
    
    const tileCount = numOfLetters.value;
    let rowOfCells = '';
    const guessCell = `<div class="cell empty"></div>`


    for (let i = 0; i < tileCount; i++) {
        rowOfCells += guessCell;
    }

    const guessElement = (`<div class="guess incomplete" data-letters="">` + rowOfCells + `</div>`);
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

const generatePlayArea = async () => {
//GENERATION SHOULD BE BOUND ELSEWHERE???
    await generateNewSolution(numOfLetters.value);
    console.log(solution);

    //This if statement might be unnecessary later on but good for now
    if (gameContainer.hidden.toString() === 'false') {
        playArea.innerHTML = "";
        toggleGameContainerVisibility();
        return;
    }

    playArea.insertAdjacentHTML('beforeend', createGameGrid());

    toggleGameContainerVisibility();
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

const handleEnterPress = async (event) => {
    const activeGuess = getActiveGuess();
    const guess = activeGuess.dataset.letters;

    if (guess.length < numOfLetters.value) {
        console.log('Not enough letters');
        return
    };

    const validatedWord = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Not a real word')
        })
        .then((responseJSON) => {
            return responseJSON[0].word;
        })
        .catch((error) => {
            console.warn(error)
            return undefined;
        });
    console.log(validatedWord);


    if (validatedWord) {
        const resultArr = computeGuess(validatedWord);

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
    }
}


const getActiveGuess = () => {
    return document.querySelector('.incomplete');
}

playButton.addEventListener('click', generatePlayArea);
allLetters.forEach(letter => letter.addEventListener('click', handleLetterPress));
deleteButton.addEventListener('click', handleDeletePress);
enterButton.addEventListener('click', handleEnterPress);