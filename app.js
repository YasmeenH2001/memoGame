document.addEventListener('DOMContentLoaded', () => {
    const levelSelectionScreen = document.getElementById('level-selection-screen');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-btn');
    const restartButton = document.getElementById('restart-btn');
    const exitButton = document.getElementById('exit-btn');
    const timerElement = document.getElementById('timer');
    const gameBoard = document.getElementById('game-board');
    const messageElement = document.getElementById('message');
    const winFace = document.getElementById('win-face');
    const loseFace = document.getElementById('lose-face');
    const finalScore = document.getElementById('final-score');
    const correctGuessesElement = document.getElementById('correct-guesses');
    const incorrectGuessesElement = document.getElementById('incorrect-guesses');

    // Game Variables
    let timer;
    let timeRemaining;
    let incorrectGuesses = 0;
    let correctGuesses = 0;
    let maxIncorrectGuesses;
    let gridSize;
    let cards;
    let flippedCards = [];
    let matchedCards = [];

    // Sample Cards (emoji)
    const cardValues = ['🍎', '🍌', '🍇', '🍉', '🍍', '🍓', '🍒', '🍑'];

    // Level Selection Events
    document.getElementById('easy-btn').addEventListener('click', () => setLevel('easy'));
    document.getElementById('medium-btn').addEventListener('click', () => setLevel('medium'));
    document.getElementById('hard-btn').addEventListener('click', () => setLevel('hard'));

    // Set the game level (Easy, Medium, Hard)
    function setLevel(level) {
        levelSelectionScreen.style.display = 'none';
        startScreen.style.display = 'block';

        if (level === 'easy') {
            gridSize = 4;
            timeRemaining = 60;
            maxIncorrectGuesses = 5;
            cards = shuffleArray([...cardValues, ...cardValues].slice(0, 16));
        } else if (level === 'medium') {
            gridSize = 6;
            timeRemaining = 45;
            maxIncorrectGuesses = 6;
            cards = shuffleArray([...cardValues, ...cardValues].slice(0, 36));
        } else if (level === 'hard') {
            gridSize = 8;
            timeRemaining = 30;
            maxIncorrectGuesses = 8;
            cards = shuffleArray([...cardValues, ...cardValues].slice(0, 64));
        }
    }

    // Start the game
    function startGame() {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        generateGameBoard();
        startTimer();
        restartButton.addEventListener('click', restartGame);
        exitButton.addEventListener('click', exitGame);
    }

    // Generate the game board
    function generateGameBoard() {
        gameBoard.innerHTML = '';
        cards.forEach((cardValue, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-id', index);
            card.setAttribute('data-value', cardValue);
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    // Flip card function
    function flipCard() {
        if (flippedCards.length >= 2) return; // Avoid more than two cards being flipped
        const card = this;

        if (flippedCards.includes(card) || card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        card.textContent = card.getAttribute('data-value');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500); // Check for match after 0.5 seconds
        }
    }

    // Check for a match
    function checkMatch() {
        const [firstCard, secondCard] = flippedCards;
        if (firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value')) {
            matchedCards.push(firstCard, secondCard);
            correctGuesses++;
            correctGuessesElement.textContent = `Correct Guesses: ${correctGuesses}`;
            if (matchedCards.length === cards.length) {
                endGame('You win!', true);
            }
        } else {
            incorrectGuesses++;
            incorrectGuessesElement.textContent = `Incorrect Guesses: ${incorrectGuesses}`;
            // Flip back the cards after a short delay
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
            }, 1000); // Wait for 1 second before flipping them back
        }

        flippedCards = [];
    }

    // Timer function
    function startTimer() {
        timer = setInterval(() => {
            timeRemaining--;
            timerElement.textContent = `Timer: ${timeRemaining}`;
            if (timeRemaining <= 0) {
                clearInterval(timer);
                endGame('Time’s up!', false);
            }
        }, 1000);
    }

    // End the game
    function endGame(message, isWin) {
        clearInterval(timer);
        messageElement.textContent = message;
        restartButton.style.display = 'block';
        exitButton.style.display = 'block';

        if (isWin) {
            winFace.style.display = 'block';
            loseFace.style.display = 'none';
        } else {
            winFace.style.display = 'none';
            loseFace.style.display = 'block';
        }

        finalScore.textContent = `Correct Guesses: ${correctGuesses}, Incorrect Guesses: ${incorrectGuesses}`;
    }

    // Restart the game
    function restartGame() {
        gameScreen.style.display = 'none';
        levelSelectionScreen.style.display = 'block';
    }

    // Exit the game
    function exitGame() {
        levelSelectionScreen.style.display = 'block';
        gameScreen.style.display = 'none';
    }

    // Shuffle array function
    function shuffleArray(arr) {
        let shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Start the game
    startButton.addEventListener('click', startGame);
});
