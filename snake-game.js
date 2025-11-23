// Juego de Snake
function initSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('snake-score');
    const highScoreElement = document.getElementById('snake-high-score');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Configuración del juego
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    // Estado del juego
    let snake = [];
    let food = {};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameRunning = false;
    let gameLoop;
    
    // Inicializar el juego
    function init() {
        // Configurar serpiente inicial
        snake = [
            {x: 10, y: 10}
        ];
        
        // Generar comida
        generateFood();
        
        // Reiniciar dirección
        dx = 0;
        dy = 0;
        
        // Reiniciar puntuación
        score = 0;
        updateScore();
        
        // Actualizar mejor puntuación
        highScoreElement.textContent = highScore;
        
        // Dibujar el estado inicial
        draw();
    }
    
    // Generar comida en una posición aleatoria
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Asegurarse de que la comida no aparezca en la serpiente
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
                break;
            }
        }
    }
    
    // Actualizar puntuación
    function updateScore() {
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
    }
    
    // Dibujar el juego
    function draw() {
        // Limpiar canvas
        ctx.fillStyle = '#0f3460';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar serpiente
        ctx.fillStyle = '#4ecdc4';
        for (let segment of snake) {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            
            // Dibujar ojos en la cabeza
            if (segment === snake[0]) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + 5, 4, 4);
                ctx.fillRect(segment.x * gridSize + 11, segment.y * gridSize + 5, 4, 4);
                ctx.fillStyle = '#4ecdc4';
            }
        }
        
        // Dibujar comida
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    
    // Actualizar el estado del juego
    function update() {
        if (!gameRunning) return;
        
        // Calcular nueva posición de la cabeza
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        // Verificar colisión con las paredes
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
        
        // Verificar colisión con el cuerpo
        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver();
                return;
            }
        }
        
        // Agregar nueva cabeza
        snake.unshift(head);
        
        // Verificar si comió la comida
        if (head.x === food.x && head.y === food.y) {
            // Incrementar puntuación
            score += 10;
            updateScore();
            
            // Generar nueva comida
            generateFood();
        } else {
            // Remover cola si no comió
            snake.pop();
        }
        
        // Dibujar el nuevo estado
        draw();
    }
    
    // Manejar fin del juego
    function gameOver() {
        gameRunning = false;
        clearInterval(gameLoop);
        alert(`¡Juego terminado! Tu puntuación: ${score}`);
    }
    
    // Manejar eventos de teclado
    document.addEventListener('keydown', function(e) {
        // Prevenir el comportamiento por defecto de las teclas de flecha
        if ([37, 38, 39, 40].includes(e.keyCode)) {
            e.preventDefault();
        }
        
        // Cambiar dirección según la tecla presionada
        switch(e.keyCode) {
            case 37: // Izquierda
                if (dx !== 1) {
                    dx = -1;
                    dy = 0;
                }
                break;
            case 38: // Arriba
                if (dy !== 1) {
                    dx = 0;
                    dy = -1;
                }
                break;
            case 39: // Derecha
                if (dx !== -1) {
                    dx = 1;
                    dy = 0;
                }
                break;
            case 40: // Abajo
                if (dy !== -1) {
                    dx = 0;
                    dy = 1;
                }
                break;
        }
    });
    
    // Eventos de botones
    startBtn.addEventListener('click', function() {
        if (!gameRunning) {
            gameRunning = true;
            gameLoop = setInterval(update, 150);
        }
    });
    
    pauseBtn.addEventListener('click', function() {
        gameRunning = !gameRunning;
        if (gameRunning) {
            gameLoop = setInterval(update, 150);
        } else {
            clearInterval(gameLoop);
        }
    });
    
    resetBtn.addEventListener('click', function() {
        clearInterval(gameLoop);
        gameRunning = false;
        init();
    });
    
    // Inicializar el juego al cargar
    init();
}