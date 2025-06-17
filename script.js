// Game variables
let ladyIndex;
let attempts = 0;
let gameStarted = false;

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', function () {
    resetGame();
});

// Shuffle cards and set up the game
function shuffleCards() {
    ladyIndex = Math.floor(Math.random() * 4);
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
        const cardFront = card.querySelector('.card-front');
        const cardBack = card.querySelector('.card-back');

        // Reset card appearance
        cardFront.textContent = '?';
        cardFront.style.display = 'flex';
        cardBack.style.backgroundImage = "url(king.jpg)";

        // Reset card flip
        card.querySelector('.card-inner').style.transform = '';

        // Re-enable clicking
        card.style.pointerEvents = 'auto';
        card.onclick = () => guess(index);
    });

    gameStarted = true;
}

// Handle card guess
function guess(index) {
    if (!gameStarted) return;

    attempts++;
    const messageElement = document.getElementById('message');
    const cards = document.querySelectorAll('.card');

    // Disable further clicking
    cards.forEach(card => {
        card.style.pointerEvents = 'none';
    });

    // Show results after a brief delay for suspense
    setTimeout(() => {
        if (index === ladyIndex && attempts === 1) {
            messageElement.textContent = `🎉 Congratulations! You found your Queen in ${attempts} attempt. You win $20! 🎉`;
            messageElement.style.background = 'rgba(0, 255, 0, 0.8)';
            playSound('win sound');
        } else {
            messageElement.textContent = `💔 Sorry, your Sweetheart was at position ${ladyIndex + 1}. You lose $30. 💔`;
            messageElement.style.background = 'rgba(255, 2, 2, 0.8)';
            playSound('loss sound');
        }

        // Reveal all cards
        revealCards();
    }, 500);

    gameStarted = false;
}

// Reveal all cards with animation
function revealCards() {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, i) => {
        const cardInner = card.querySelector('.card-inner');
        const cardFront = card.querySelector('.card-front');
        const cardBack = card.querySelector('.card-back');

        setTimeout(() => {
            if (i === ladyIndex) {
                // Show queen
                cardBack.style.backgroundImage = "url(queen_wallpaper.jpg)";
                cardFront.style.display = 'none';
            } else {
                // Show X for wrong cards
                cardFront.textContent = '❌';
                cardFront.style.background = 'rgba(255, 0, 0, 0.8)';
            }

            // Flip card
            cardInner.style.transform = 'rotateY(180deg)';

            // Add celebration effect for queen
            if (i === ladyIndex) {
                card.style.animation = 'celebration 1s ease-in-out';
            }
        }, i * 200); // Stagger the reveal
    });
}

// Reset the game
function resetGame() {
    attempts = 0;
    gameStarted = false;

    const messageElement = document.getElementById('message');
    messageElement.textContent = '';
    messageElement.style.background = 'rgba(255, 2, 2, 0.8)';

    // Reset cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.animation = '';
        card.style.pointerEvents = 'auto';
    });

    // Start new game
    shuffleCards();
}

// Play sound with error handling
function playSound(soundId) {
    try {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0; // Reset to beginning
            sound.play().catch(e => {
                console.log('Could not play sound:', e);
            });
        }
    } catch (error) {
        console.log('Sound playback error:', error);
    }
}

// Add celebration animation
const style = document.createElement('style');
style.textContent = `
    @keyframes celebration {
        0% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.1) rotate(-5deg); }
        50% { transform: scale(1.2) rotate(5deg); }
        75% { transform: scale(1.1) rotate(-3deg); }
        100% { transform: scale(1) rotate(0deg); }
    }
`;
document.head.appendChild(style);