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
    let timeRemaining = 60; // example timer (in seconds)
    let incorrectGuesses = 0;
    let correctGuesses = 0;
    const maxIncorrectGuesses = 5;
    
    // Sample Cards
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
        resetMessages(); // Reset any messages when the game starts
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
    
        // Reset game variables
        incorrectGuesses = 0;
        correctGuesses = 0;
        updateGuessDisplay(); // Update the display
        timeRemaining = 60;
        timerElement.textContent = `Timer: 01:00`; // Reset timer text
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

        // Flip the card as long as it has not been flipped yet
        flippedCards.push(card);
        card.classList.add('flipped');
        card.textContent = card.dataset.cardValue;

        // Check if two cards are flipped
        if (flippedCards.length === 2) {
            setTimeout(() => checkMatch(), 1000);
        }
    }

    // Check if the flipped cards match
    function checkMatch() {
        const [card1, card2] = flippedCards;
    
        if (card1.dataset.cardValue === card2.dataset.cardValue) {
            // Cards match, keep them face-up
            correctGuesses++;
            flippedCards = [];
            updateGuessDisplay(); // Update the display
            checkWin(); // Check for win condition
        } else {
            // Cards don't match, flip them back
            setTimeout(() => {
                card1.textContent = '🂠';
                card2.textContent = '🂠';
                flippedCards = [];
            }, 500); // Delay flipping back to make it more visible
    
            incorrectGuesses++;
            updateGuessDisplay(); // Update the display
    
            // Check if player exceeded incorrect guess limit
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

    // End the game (win or lose)
    function endGame(message, isWin) {
        clearInterval(timer);
        displayMessage(message); // Show end message
        restartButton.style.display = 'block'; // Show restart button
        
        // Show the correct face based on win/lose
        if (isWin) {
            winFace.style.display = 'block';
            loseFace.style.display = 'none';
        } else {
            winFace.style.display = 'none';
            loseFace.style.display = 'block';
        }

        finalScore.textContent = `Correct Guesses: ${correctGuesses}, Incorrect Guesses: ${incorrectGuesses}`;
    }

    // Display a message
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

    // Update the correct and incorrect guesses display
    function updateGuessDisplay() {
        correctGuessesElement.textContent = `Correct Guesses: ${correctGuesses}`;
        incorrectGuessesElement.textContent = `Incorrect Guesses: ${incorrectGuesses}`;
    }

    // Restart the game
    restartButton.addEventListener('click', () => {
        restartButton.style.display = 'none'; // Hide the restart button
        gameScreen.style.display = 'none'; // Hide game screen
        startScreen.style.display = 'block'; // Show start screen again
        resetMessages();  // Reset any messages when restarting
    });

    // Start button event listener
    startButton.addEventListener('click', startGame);
});

// Add event listener for the start button
document.getElementById("start-btn").addEventListener("click", function() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    startGame(); // Assuming startGame initializes your game logic
});

// Function to handle the game ending
function endGame(won) {
    // Hide both faces initially
    document.getElementById("win-face").style.display = "none";
    document.getElementById("lose-face").style.display = "none";

    // Show the correct face based on win/lose status
    if (won) {
        document.getElementById("win-face").style.display = "block"; // Show happy face
    } else {
        document.getElementById("lose-face").style.display = "block"; // Show sad face
    }

    // Optionally, show a message
    document.getElementById("message").innerText = won ? "You Win!" : "You Lose!";
    document.getElementById("message").style.display = "block";
}

// Example to trigger the end of the game (use your own logic here):
// Simulating a win after 2 seconds
setTimeout(() => {
    endGame(true); // Call endGame() with `true` for a win
}, 2000);

// Simulating a loss after 4 seconds
setTimeout(() => {
    endGame(false); // Call endGame() with `false` for a loss
}, 4000);
