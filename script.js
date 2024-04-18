document.addEventListener("DOMContentLoaded", function() {
    const placeBetBtn = document.getElementById('placeBetBtn');
    const betInput = document.getElementById('betInput');
    const balanceDisplay = document.getElementById('balanceDisplay');
    const withdrawDisplay = document.getElementById('withdrawDisplay');
    const errorMessage = document.getElementById('errorMessage');
    const gameContainer = document.querySelector('.game-board');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const gameOverMessage = document.querySelector('.game-over');

    let balance = 100;
    let betAmount = 0;
    let winAmount = 0;
    let bombsFound = 0;
    const bombCount = 3;

    withdrawBtn.style.display = 'none';
    gameOverMessage.style.display = 'none';

    placeBetBtn.addEventListener('click', function() {
        resetGame();
        errorMessage.textContent = '';
        betAmount = parseInt(betInput.value);
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
            errorMessage.textContent = 'Enter a valid bet amount';
            return;
        }
        balance -= betAmount;
        balanceDisplay.textContent = `Balance: ${balance} tokens`;
        winAmount = betAmount;
        generateGrid();
        withdrawBtn.style.display = 'block';
    });

    function generateGrid() {
        gameContainer.innerHTML = '';
        let bombPlaced = 0;
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (Math.random() < 0.3 && bombPlaced < bombCount) {
                cell.textContent = '💣';
                cell.classList.add('bomb');
                bombPlaced++;
            } else {
                cell.textContent = '💎';
            }
            gameContainer.appendChild(cell);
        }
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', function() {
                revealTile(cell);
            });
        });
    }

    function revealTile(cell) {
        if (!cell.classList.contains('revealed')) {
            cell.classList.add('revealed');
            if (cell.classList.contains('bomb')) {
                bombsFound++;
                if (bombsFound === 1) {
                    setTimeout(() => gameOver(true), 100);
                } else if (bombsFound === bombCount) {
                    gameOver(true);
                }
            } else {
                winAmount += 0.25 * betAmount;
                withdrawDisplay.textContent = `Withdraw Amount: ${winAmount} tokens`;
            }
        }
    }

    function gameOver(isBombExploded) {
        gameContainer.innerHTML = '';
        gameOverMessage.style.display = 'block';
        if (isBombExploded) {
            gameOverMessage.textContent = 'Game Over 💥';
            gameOverMessage.style.color = 'red';
        } else {
            gameOverMessage.textContent = 'Game Over 🎉';
            gameOverMessage.style.color = 'green';
        }
        winAmount = 0;
        withdrawDisplay.textContent = `Withdraw Amount: ${winAmount} tokens`;
        withdrawBtn.style.display = 'none';
    }

    withdrawBtn.addEventListener('click', function() {
        balance += winAmount;
        balanceDisplay.textContent = `Balance: ${balance} tokens`;
        winAmount = 0;
        withdrawDisplay.textContent = `Withdraw Amount: ${winAmount} tokens`;
        gameOver(false);
    });

    function resetGame() {
        bombsFound = 0;
        gameOverMessage.style.display = 'none';
    }
});
