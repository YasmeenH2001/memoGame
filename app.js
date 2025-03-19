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
    let timeRemaining = 60;
    let incorrectGuesses = 0;
    let correctGuesses = 0;
    const maxIncorrectGuesses = 5;
    
    // Sample Cards
    const cards = [
        '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍉', '🍉',
        '🍍', '🍍', '🍓', '🍓', '🍒', '🍒', '🍑', '🍑'
    ];
    
    function startGame() {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        initializeGame();
        startTimer();
        resetMessages();
    }

    function initializeGame() {
        const shuffledCards = shuffleArray(cards);
    
        gameBoard.innerHTML = ''; // Clear existing game board
        shuffledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.cardValue = card;
            cardElement.textContent = '🂠'; // Initial face-down card
            gameBoard.appendChild(cardElement);
            cardElement.addEventListener('click', handleCardClick);
        });
    
        incorrectGuesses = 0;
        correctGuesses = 0;
        updateGuessDisplay();
        timeRemaining = 60;
        timerElement.textContent = `Timer: 01:00`;
    }

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

        // Allow repeated flips for the same card
        if (flippedCards.includes(card)) return;

        flippedCards.push(card);
        card.classList.add('flipped');
        card.textContent = card.dataset.cardValue;

        if (flippedCards.length === 2) {
            setTimeout(() => checkMatch(), 500);
        }
    }

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
                flippedCards = [];
            }, 500);
    
            incorrectGuesses++;
            updateGuessDisplay();
    
            if (incorrectGuesses >= maxIncorrectGuesses) {
                endGame('Game Over: Too many incorrect guesses!', false);
            }
        }
    }

    function checkWin() {
        if (correctGuesses === cards.length / 2) {
            endGame('You Win! All pairs matched!', true);
        }
    }

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

    function endGame(message, isWin) {
        clearInterval(timer);
        displayMessage(message);
        restartButton.style.display = 'block';
        
        if (isWin) {
            winFace.style.display = 'block';
            loseFace.style.display = 'none';
        } else {
            winFace.style.display = 'none';
            loseFace.style.display = 'block';
        }

        finalScore.textContent = `Correct Guesses: ${correctGuesses}, Incorrect Guesses: ${incorrectGuesses}`;
    }

    function displayMessage(message) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';
    }

    function resetMessages() {
        messageElement.style.display = 'none';
        winFace.style.display = 'none';
        loseFace.style.display = 'none';
    }

    function updateGuessDisplay() {
        correctGuessesElement.textContent = `Correct Guesses: ${correctGuesses}`;
        incorrectGuessesElement.textContent = `Incorrect Guesses: ${incorrectGuesses}`;
    }

    restartButton.addEventListener('click', () => {
        restartButton.style.display = 'none';
        gameScreen.style.display = 'none';
        startScreen.style.display = 'block';
        resetMessages();
    });

    startButton.addEventListener('click', startGame);
});
