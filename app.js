document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-btn');
    const restartButton = document.getElementById('restart-btn');
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
    let timeRemaining = 60; // Set timer to 60 seconds
    let incorrectGuesses = 0;
    let correctGuesses = 0;
    const maxIncorrectGuesses = 5;

    // Sample Cards
    const cards = [
        '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍉', '🍉',
        '🍍', '🍍', '🍓', '🍓', '🍒', '🍒', '🍑', '🍑'
    ];

    // Start the game
    function startGame() {
        startScreen.style.display = 'none'; // Hide start screen
        gameScreen.style.display = 'block'; // Show game screen
        initializeGame();
        startTimer();
        resetMessages();
    }

    // Initialize the game (shuffle and render cards)
    function initializeGame() {
        const shuffledCards = shuffleArray(cards);

        // Clear the previous game board and add shuffled cards
        gameBoard.innerHTML = '';
        shuffledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.cardValue = card;
            cardElement.textContent = '🂠'; // Show face down initially
            gameBoard.appendChild(cardElement);
            cardElement.addEventListener('click', handleCardClick);
        });

        incorrectGuesses = 0;
        correctGuesses = 0;
        updateGuessDisplay();
        timeRemaining = 60;
        timerElement.textContent = `Timer: 01:00`;
    }

    // Shuffle the cards (Fisher-Yates Algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    let flippedCards = [];
    function handleCardClick(event) {
        const card = event.target;

        // Allow user to flip card as long as it hasn't already been flipped
        if (flippedCards.includes(card) || card.classList.contains('flipped')) return;

        flippedCards.push(card);
        card.classList.add('flipped');
        card.textContent = card.dataset.cardValue;

        if (flippedCards.length === 2) {
            setTimeout(() => checkMatch(), 500); // Delay for checking match
        }
    }

    // Check if two flipped cards match
    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.cardValue === card2.dataset.cardValue) {
            correctGuesses++;
            flippedCards = [];
            updateGuessDisplay();
            checkWin();
        } else {
            setTimeout(() => {
                card1.textContent = '🂠';
                card2.textContent = '🂠';
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
            }, 500);

            incorrectGuesses++;
            updateGuessDisplay();

            if (incorrectGuesses >= maxIncorrectGuesses) {
                endGame('Game Over: Too many incorrect guesses!', false);
            }
        }
    }

    // Check if all pairs are matched (win condition)
    function checkWin() {
        if (correctGuesses === cards.length / 2) {
            endGame('You Win! All pairs matched!', true);
        }
    }

    // Start the timer
    function startTimer() {
        timer = setInterval(() => {
            timeRemaining--;
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerElement.textContent = `Timer: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            if (timeRemaining <= 0) {
                endGame('Game Over: Time is up!', false);
            }
        }, 1000);
    }

    // End the game
    function endGame(message, isWin) {
        clearInterval(timer);
        displayMessage(message);
        restartButton.style.display = 'block';

        // Show win or lose face based on result
        if (isWin) {
            winFace.style.display = 'block';
            loseFace.style.display = 'none';
        } else {
            winFace.style.display = 'none';
            loseFace.style.display = 'block';
        }

        finalScore.textContent = `Correct Guesses: ${correctGuesses}, Incorrect Guesses: ${incorrectGuesses}`;
    }

    // Display the message when the game ends
    function displayMessage(message) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';
    }

    // Reset the message display
    function resetMessages() {
        messageElement.style.display = 'none';
        winFace.style.display = 'none';
        loseFace.style.display = 'none';
    }

    // Update the guess count display
    function updateGuessDisplay() {
        correctGuessesElement.textContent = `Correct Guesses: ${correctGuesses}`;
        incorrectGuessesElement.textContent = `Incorrect Guesses: ${incorrectGuesses}`;
    }

    // Restart the game
    restartButton.addEventListener('click', () => {
        restartButton.style.display = 'none';
        gameScreen.style.display = 'none';
        startScreen.style.display = 'block';
        resetMessages();
    });

    // Start Button Event
    startButton.addEventListener('click', startGame);
});
