document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const levelSelectionScreen = document.getElementById('level-selection-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-btn');
    const startLevelButton = document.getElementById('start-level-btn');
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

    let timer;
    let timeRemaining;
    let incorrectGuesses = 0;
    let correctGuesses = 0;
    let maxIncorrectGuesses;
    let gridSize;
    let cards;
    let flippedCards = [];
    let matchedCards = [];

    const cardValues = ['🍎', '🍌', '🍇', '🍉', '🍍', '🍓', '🍒', '🍑', '🥝', '🥥'];

    startButton.addEventListener('click', () => {
        welcomeScreen.style.display = 'none';
        levelSelectionScreen.style.display = 'block';
    });

    document.getElementById('easy-btn').addEventListener('click', () => setLevel('easy'));
    document.getElementById('medium-btn').addEventListener('click', () => setLevel('medium'));
    document.getElementById('hard-btn').addEventListener('click', () => setLevel('hard'));

    startLevelButton.addEventListener('click', () => {
        levelSelectionScreen.style.display = 'none';
        gameScreen.style.display = 'block';
    });

    function setLevel(level) {
        levelSelectionScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        startGame(level);
    }

    function startGame(level) {
        if (level === 'easy') {
            gridSize = 4;
            timeRemaining = 60;
            maxIncorrectGuesses = 4;
            cards = shuffleArray([...cardValues, ...cardValues].slice(0, 12));
            gameBoard.style.gridTemplateColumns = 'repeat(4, 100px)';
        } else if (level === 'medium') {
            gridSize = 4;
            timeRemaining = 50;
            maxIncorrectGuesses = 5;
            cards = shuffleArray([...cardValues, ...cardValues].slice(0, 16));
            gameBoard.style.gridTemplateColumns = 'repeat(4, 100px)';
        } else if (level === 'hard') {
            gridSize = 5;
            timeRemaining = 40;
            maxIncorrectGuesses = 6;
            cards = shuffleArray([...cardValues, ...cardValues].slice(0, 20));
            gameBoard.style.gridTemplateColumns = 'repeat(5, 100px)';
        }

        generateGameBoard();
        startTimer();
        restartButton.addEventListener('click', restartGame);
        exitButton.addEventListener('click', exitGame);
        updateStats();
    }

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

    function flipCard() {
        if (flippedCards.length >= 2 || incorrectGuesses >= maxIncorrectGuesses) return;
        const card = this;
        if (flippedCards.includes(card) || card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        card.textContent = card.getAttribute('data-value');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 300);
        }
    }

    function checkMatch() {
        const [firstCard, secondCard] = flippedCards;
        if (firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value')) {
            matchedCards.push(firstCard, secondCard);
            correctGuesses++;
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            if (matchedCards.length === cards.length) {
                endGame('You win!', true);
            }
        } else {
            incorrectGuesses++;
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard.textContent = '';
                secondCard.textContent = '';
            }, 700);
            if (incorrectGuesses >= maxIncorrectGuesses) {
                endGame('You lost!', false);
            }
        }
        flippedCards = [];
        updateStats();
    }

    function startTimer() {
        timerElement.textContent = `Timer: ${timeRemaining}`;
        timer = setInterval(() => {
            timeRemaining--;
            timerElement.textContent = `Timer: ${timeRemaining}`;
            if (timeRemaining <= 0) {
                clearInterval(timer);
                endGame('Time’s up!', false);
            }
        }, 1000);
    }

    function updateStats() {
        correctGuessesElement.textContent = `Correct Guesses: ${correctGuesses}`;
        incorrectGuessesElement.textContent = `Incorrect Guesses: ${incorrectGuesses}`;
    }

    function endGame(message, isWin) {
        clearInterval(timer);
        messageElement.textContent = message;
        restartButton.style.display = 'inline-block';
        exitButton.style.display = 'inline-block';
        winFace.style.display = isWin ? 'block' : 'none';
        loseFace.style.display = isWin ? 'none' : 'block';
        finalScore.textContent = `Correct Guesses: ${correctGuesses}, Incorrect Guesses: ${incorrectGuesses}`;
    }

    function restartGame() {
        gameScreen.style.display = 'none';
        levelSelectionScreen.style.display = 'block';
        resetGame();
    }

    function exitGame() {
        welcomeScreen.style.display = 'block';
        gameScreen.style.display = 'none';
        resetGame();
    }

    function resetGame() {
        incorrectGuesses = 0;
        correctGuesses = 0;
        matchedCards = [];
        flippedCards = [];
        gameBoard.innerHTML = '';
        messageElement.textContent = '';
        finalScore.textContent = '';
        winFace.style.display = 'none';
        loseFace.style.display = 'none';
        restartButton.style.display = 'none';
        exitButton.style.display = 'none';
    }

    function shuffleArray(arr) {
        let shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
});
