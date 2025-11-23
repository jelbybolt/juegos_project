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
            highScoreElement.classList.add('celebrate');
            setTimeout(() => highScoreElement.classList.remove('celebrate'), 1000);
        }
    }
    
    // Dibujar el juego
    function draw() {
        // Limpiar canvas
        ctx.fillStyle = '#0f3460';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar patrón de fondo
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Dibujar serpiente con gradiente
        const snakeGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        snakeGradient.addColorStop(0, '#4ECDC4');
        snakeGradient.addColorStop(1, '#36D1DC');
        
        for (let i = 0; i < snake.length; i++) {
            const segment = snake[i];
            
            // Cabeza de la serpiente
            if (i === 0) {
                ctx.fillStyle = snakeGradient;
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
                
                // Ojos
                ctx.fillStyle = '#FFF';
                ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + 5, 4, 4);
                ctx.fillRect(segment.x * gridSize + 11, segment.y * gridSize + 5, 4, 4);
            } else {
                // Cuerpo de la serpiente
                ctx.fillStyle = snakeGradient;
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
                
                // Efecto de segmentación
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 6, gridSize - 6);
            }
        }
        
        // Dibujar comida con efecto brillante
        ctx.fillStyle = '#FF6584';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Efecto de brillo en la comida
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2 - 3,
            food.y * gridSize + gridSize / 2 - 3,
            3,
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
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
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
            
            // Efecto visual al comer
            scoreElement.classList.add('pulse');
            setTimeout(() => scoreElement.classList.remove('pulse'), 300);
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
        
        // Efecto visual de game over
        canvas.style.filter = 'brightness(0.7)';
        setTimeout(() => {
            canvas.style.filter = 'brightness(1)';
        }, 500);
        
        setTimeout(() => {
            alert(`¡Juego terminado! 🐍\nTu puntuación: ${score}\nMejor puntuación: ${highScore}`);
        }, 300);
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
            // Si es el primer movimiento, establecer dirección inicial
            if (dx === 0 && dy === 0) {
                dx = 1; // Empezar moviéndose a la derecha
            }
            gameLoop = setInterval(update, 150);
            startBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
        }
    });
    
    pauseBtn.addEventListener('click', function() {
        gameRunning = !gameRunning;
        if (gameRunning) {
            gameLoop = setInterval(update, 150);
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        } else {
            clearInterval(gameLoop);
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
        }
    });
    
    resetBtn.addEventListener('click', function() {
        clearInterval(gameLoop);
        gameRunning = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar Juego';
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        init();
    });
    
    // Inicializar el juego al cargar
    init();
}