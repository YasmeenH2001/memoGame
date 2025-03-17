document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-btn');
    const restartButton = document.getElementById('restart-btn');
    const timerElement = document.getElementById('timer');
    const gameBoard = document.getElementById('game-board');

    // Game Variables
    let timer;
    let timeRemaining = 60;  // example timer (in seconds)
    let incorrectGuesses = 0;
    const maxIncorrectGuesses = 5;

    // Sample Cards (You can move this to data.js if needed)
    const cards = [
        '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍉', '🍉',
        '🍍', '🍍', '🍓', '🍓', '🍒', '🍒', '🍑', '🍑'
    ];

    // Function to start the game
    function startGame() {
        startScreen.style.display = 'none'; // Hide start screen
        gameScreen.style.display = 'block'; // Show game screen
        initializeGame();
        startTimer();
    }

    // Function to initialize game (shuffle cards and render board)
    function initializeGame() {
        // Shuffle cards
        const shuffledCards = shuffleArray(cards);

        // Create card elements
        gameBoard.innerHTML = ''; // Clear existing game board
        shuffledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.cardValue = card;
            cardElement.textContent = '🂠'; // Initial face-down card
            gameBoard.appendChild(cardElement);
            cardElement.addEventListener('click', handleCardClick);
        });
    }

    // Shuffle the array (Fisher-Yates Algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Handle card click
    let flippedCards = [];
    function handleCardClick(event) {
        const card = event.target;
        if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
            flippedCards.push(card);
            card.classList.add('flipped');
            card.textContent = card.dataset.cardValue;

            // Check if two cards are flipped
            if (flippedCards.length === 2) {
                setTimeout(() => checkMatch(), 1000);
            }
        }
    }

    // Check if the flipped cards match
    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.cardValue === card2.dataset.cardValue) {
            // Cards match, keep them face-up
            flippedCards = [];
        } else {
            // Cards don't match, flip them back
            card1.textContent = '🂠';
            card2.textContent = '🂠';
            flippedCards = [];
            incorrectGuesses++;

            // Check if player exceeded incorrect guess limit
            if (incorrectGuesses >= maxIncorrectGuesses) {
                endGame('Game Over: Too many incorrect guesses!');
            }
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
                endGame('Game Over: Time is up!');
            }
        }, 1000);
    }

    // End the game (win or lose)
    function endGame(message) {
        clearInterval(timer);
        alert(message); // Show end message
        restartButton.style.display = 'block'; // Show restart button
    }

    // Restart the game
    restartButton.addEventListener('click', () => {
        timeRemaining = 60;
        incorrectGuesses = 0;
        restartButton.style.display = 'none';
        startGame(); // Restart game
    });

    // Start button event listener
    startButton.addEventListener('click', startGame);
});