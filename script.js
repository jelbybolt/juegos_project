// Script principal para manejar la navegación entre juegos
document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('back-btn');
    const gameArea = document.getElementById('game-area');
    const gamesContainer = document.querySelector('.games-container');
    
    backBtn.addEventListener('click', function() {
        gameArea.classList.add('hidden');
        gamesContainer.classList.remove('hidden');
        document.getElementById('game-content').innerHTML = '';
    });
});

function loadGame(gameType) {
    const gameArea = document.getElementById('game-area');
    const gamesContainer = document.querySelector('.games-container');
    const gameContent = document.getElementById('game-content');
    
    gamesContainer.classList.add('hidden');
    gameArea.classList.remove('hidden');
    
    if (gameType === 'rps') {
        gameContent.innerHTML = `
            <div class="rps-container">
                <h2 class="rps-title">Piedra, Papel, Tijera</h2>
                <div class="rps-score">
                    <div class="score-box">
                        <div class="score-label">Jugador</div>
                        <div class="score-value" id="player-score">0</div>
                    </div>
                    <div class="score-box">
                        <div class="score-label">Computadora</div>
                        <div class="score-value" id="computer-score">0</div>
                    </div>
                </div>
                <div class="choices-container">
                    <button class="choice-btn" data-choice="rock">✊</button>
                    <button class="choice-btn" data-choice="paper">✋</button>
                    <button class="choice-btn" data-choice="scissors">✌️</button>
                </div>
                <div class="result-container">
                    <div class="choices-display">
                        <div class="choice-display">
                            <div class="choice-icon" id="player-choice-icon">❔</div>
                            <div class="choice-label">Tu elección</div>
                        </div>
                        <div class="vs-text">VS</div>
                        <div class="choice-display">
                            <div class="choice-icon" id="computer-choice-icon">❔</div>
                            <div class="choice-label">Computadora</div>
                        </div>
                    </div>
                    <div class="result-text" id="round-result-text">Elige una opción para comenzar</div>
                    <div class="round-result" id="game-status">Primero en ganar 3 rondas gana el juego</div>
                </div>
                <div id="game-over-container" class="game-over hidden">
                    <h3 id="final-result">¡Has ganado!</h3>
                    <button class="reset-btn" id="rps-reset-btn">Jugar de nuevo</button>
                </div>
            </div>
        `;
        
        initRPSGame();
    } else if (gameType === 'snake') {
        gameContent.innerHTML = `
            <div class="snake-container">
                <h2 class="snake-title">Snake</h2>
                <div class="snake-game-info">
                    <div class="snake-score">
                        <div class="score-label">Puntuación</div>
                        <div class="score-value" id="snake-score">0</div>
                    </div>
                    <div class="snake-high-score">
                        <div class="score-label">Mejor Puntuación</div>
                        <div class="score-value" id="snake-high-score">0</div>
                    </div>
                </div>
                <div class="snake-canvas-container">
                    <canvas id="snake-canvas" width="400" height="400"></canvas>
                </div>
                <div class="snake-controls">
                    <button class="control-btn" id="start-btn">Iniciar Juego</button>
                    <button class="control-btn" id="pause-btn">Pausar</button>
                    <button class="control-btn" id="reset-btn">Reiniciar</button>
                </div>
                <div class="snake-instructions">
                    <h4>Instrucciones:</h4>
                    <p>Usa las flechas del teclado para controlar la serpiente. Come la comida (roja) para crecer y ganar puntos. Evita chocar con las paredes o contigo mismo.</p>
                </div>
            </div>
        `;
        
        initSnakeGame();
    }
}