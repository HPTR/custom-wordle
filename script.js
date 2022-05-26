const randomWords = require('random-words');


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

console.log(generateWordOfLength(10));
console.log(generateWordOfLength(10));
console.log(generateWordOfLength(10));
console.log(generateWordOfLength(10));
console.log(generateWordOfLength(10));
console.log(generateWordOfLength(10));
console.log(generateWordOfLength(10));
console.log(generateWordOfLength(10));