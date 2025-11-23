// Juego de Piedra, Papel, Tijera
function initRPSGame() {
    let playerScore = 0;
    let computerScore = 0;
    let gameOver = false;
    
    const playerScoreElement = document.getElementById('player-score');
    const computerScoreElement = document.getElementById('computer-score');
    const playerChoiceIcon = document.getElementById('player-choice-icon');
    const computerChoiceIcon = document.getElementById('computer-choice-icon');
    const roundResultText = document.getElementById('round-result-text');
    const gameStatus = document.getElementById('game-status');
    const gameOverContainer = document.getElementById('game-over-container');
    const finalResult = document.getElementById('final-result');
    const resetBtn = document.getElementById('rps-reset-btn');
    
    const choiceButtons = document.querySelectorAll('.choice-btn');
    
    // Asignar eventos a los botones de elección
    choiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (gameOver) return;
            
            const playerChoice = this.getAttribute('data-choice');
            playRound(playerChoice);
        });
    });
    
    // Función para jugar una ronda
    function playRound(playerChoice) {
        // Remover selección anterior
        choiceButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Marcar la elección actual
        document.querySelector(`[data-choice="${playerChoice}"]`).classList.add('selected');
        
        // Elección de la computadora
        const computerChoice = getComputerChoice();
        
        // Mostrar elecciones
        playerChoiceIcon.textContent = getChoiceIcon(playerChoice);
        computerChoiceIcon.textContent = getChoiceIcon(computerChoice);
        
        // Determinar el resultado
        const result = getRoundResult(playerChoice, computerChoice);
        
        // Actualizar puntuación y mostrar resultado
        if (result === 'win') {
            playerScore++;
            roundResultText.textContent = '¡Ganaste esta ronda!';
            roundResultText.style.color = '#4ecdc4';
        } else if (result === 'lose') {
            computerScore++;
            roundResultText.textContent = 'La computadora ganó esta ronda';
            roundResultText.style.color = '#ff6b6b';
        } else {
            roundResultText.textContent = '¡Empate!';
            roundResultText.style.color = '#f9ca24';
        }
        
        // Actualizar puntuaciones
        playerScoreElement.textContent = playerScore;
        computerScoreElement.textContent = computerScore;
        
        // Verificar si el juego ha terminado
        if (playerScore === 3 || computerScore === 3) {
            gameOver = true;
            showGameOver();
        } else {
            gameStatus.textContent = `Siguiente ronda...`;
        }
    }
    
    // Función para obtener la elección de la computadora
    function getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }
    
    // Función para determinar el resultado de la ronda
    function getRoundResult(player, computer) {
        if (player === computer) {
            return 'tie';
        }
        
        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'win';
        }
        
        return 'lose';
    }
    
    // Función para obtener el icono correspondiente a la elección
    function getChoiceIcon(choice) {
        switch(choice) {
            case 'rock': return '✊';
            case 'paper': return '✋';
            case 'scissors': return '✌️';
            default: return '❔';
        }
    }
    
    // Función para mostrar la pantalla de fin de juego
    function showGameOver() {
        if (playerScore > computerScore) {
            finalResult.textContent = '¡Felicidades! Has ganado el juego';
            finalResult.style.color = '#4ecdc4';
        } else {
            finalResult.textContent = '¡La computadora ha ganado el juego!';
            finalResult.style.color = '#ff6b6b';
        }
        
        gameOverContainer.classList.remove('hidden');
    }
    
    // Evento para reiniciar el juego
    resetBtn.addEventListener('click', function() {
        playerScore = 0;
        computerScore = 0;
        gameOver = false;
        
        playerScoreElement.textContent = '0';
        computerScoreElement.textContent = '0';
        playerChoiceIcon.textContent = '❔';
        computerChoiceIcon.textContent = '❔';
        roundResultText.textContent = 'Elige una opción para comenzar';
        roundResultText.style.color = '#fff';
        gameStatus.textContent = 'Primero en ganar 3 rondas gana el juego';
        
        choiceButtons.forEach(btn => btn.classList.remove('selected'));
        gameOverContainer.classList.add('hidden');
    });
}