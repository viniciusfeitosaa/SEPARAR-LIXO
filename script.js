class TrashGame {
    constructor() {
        this.score = 0;
        this.lives = 5; // Aumentado para 5 vidas
        this.level = 1;
        this.correctHits = 0; // Contador de acertos para subir de nível
        this.gameRunning = false;
        this.gamePaused = false;
        this.currentTrash = null;
        this.selectedBin = null;
        this.fallSpeed = 3000; // 3 segundos para cair
        this.spawnInterval = null;
        this.fallInterval = null;
        
        // Dados dos tipos de lixo com seus assets
        this.trashTypes = {
            paper: {
                items: ['Assets/papel1.png', 'Assets/papel2.png'],
                color: '#4682B4',
                binType: 'paper'
            },
            plastic: {
                items: ['Assets/plastico1.png', 'Assets/plastico2.png'],
                color: '#CD5C5C',
                binType: 'plastic'
            },
            glass: {
                items: ['Assets/vidro1.png', 'Assets/vidro2.png'],
                color: '#228B22',
                binType: 'glass'
            },
            metal: {
                items: ['Assets/metal1.png', 'Assets/metal2.png'],
                color: '#FFD700',
                binType: 'metal'
            },
            organic: {
                items: ['Assets/organico1.png', 'Assets/organico2.png'],
                color: '#8B4513',
                binType: 'organic'
            }
        };
        
        this.gridColumns = 5; // 5 colunas para o grid
        this.currentColumn = 2; // Começa no meio (coluna 2)
        this.columnWidth = null; // Será definido após DOM carregar
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.bindEvents();
        this.updateDisplay();
        this.initializeHearts(); // Inicializar corações na primeira carga
        this.setColumnWidth();
        window.addEventListener('resize', () => {
            this.recalculateSizes();
        });
        // Removido: this.setupGyroToggleButton();
    }
    
    bindEvents() {
        // Botões do jogo
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('play-again-btn').addEventListener('click', () => this.restartGame());
        
        // Controles do teclado
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Controles mobile
        document.getElementById('left-control').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveTrashLeft();
        });
        
        document.getElementById('right-control').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveTrashRight();
        });
        
        // Suporte para clique também (para testes em desktop)
        document.getElementById('left-control').addEventListener('click', () => this.moveTrashLeft());
        document.getElementById('right-control').addEventListener('click', () => this.moveTrashRight());
        
        // Controles de deslize para mobile
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!this.gameRunning || this.gamePaused) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = endX - startX;
            const diffY = endY - startY;
            
            // Verificar se foi um deslize horizontal
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
                if (diffX > 0) {
                    this.moveTrashRight();
                } else {
                    this.moveTrashLeft();
                }
            }
        });
        
        // Removido: this.initGyroscope();
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 5; // Aumentado para 5 vidas
        this.level = 1;
        this.correctHits = 0; // Resetar contador de acertos
        
        // Atualizar botões
        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;
        document.getElementById('restart-btn').disabled = false;
        
        this.updateDisplay();
        this.initializeHearts(); // Inicializar corações
        this.spawnTrash();
        
        // Iniciar intervalo de spawn
        this.spawnInterval = setInterval(() => {
            if (!this.gamePaused) {
                this.spawnTrash();
            }
        }, 2000);
    }
    
    // Ajustar togglePause para pausar/retomar animação do lixo
    togglePause() {
        if (!this.gameRunning) return;
        this.gamePaused = !this.gamePaused;
        const pauseBtn = document.getElementById('pause-btn');
        if (this.gamePaused) {
            pauseBtn.textContent = 'Continuar';
            // Pausar animação do lixo e colisão
            document.querySelectorAll('.falling-trash').forEach(trash => {
                // Pausa: a animação e o intervalo de colisão param automaticamente
            });
        } else {
            pauseBtn.textContent = 'Pausar';
            // Retomar animação do lixo e colisão
            document.querySelectorAll('.falling-trash').forEach(trash => {
                if (typeof trash._animateFall === 'function') {
                    requestAnimationFrame(trash._animateFall);
                }
            });
        }
    }
    
    restartGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        
        // Limpar intervalos
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        if (this.fallInterval) {
            clearInterval(this.fallInterval);
        }
        
        // Limpar lixo na tela
        document.querySelectorAll('.falling-trash').forEach(trash => trash.remove());
        
        // Resetar seleções
        this.currentTrash = null;
        this.selectedBin = null;
        this.correctHits = 0; // Resetar contador de acertos
        
        // Fechar modal
        document.getElementById('game-over-modal').style.display = 'none';
        
        // Resetar botões
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('restart-btn').disabled = true;
        document.getElementById('pause-btn').textContent = 'Pausar';
        
        this.updateDisplay();
        this.initializeHearts(); // Reinicializar corações
    }
    
    spawnTrash() {
        if (this.gamePaused) return;
        const sky = document.getElementById('sky');
        const trashTypes = Object.keys(this.trashTypes);
        const randomType = trashTypes[Math.floor(Math.random() * trashTypes.length)];
        const trashData = this.trashTypes[randomType];
        const randomItem = trashData.items[Math.floor(Math.random() * trashData.items.length)];

        // Escolher coluna aleatória
        this.currentColumn = Math.floor(Math.random() * this.gridColumns);

        const trash = document.createElement('div');
        trash.className = `falling-trash ${randomType}`;
        trash.dataset.type = randomType;
        trash.dataset.correctBin = trashData.binType;
        trash.dataset.column = this.currentColumn;

        // Criar imagem do lixo
        const trashImg = document.createElement('img');
        trashImg.src = randomItem;
        trashImg.alt = 'Lixo';
        trashImg.style.width = '100%';
        trashImg.style.height = '100%';
        trashImg.style.objectFit = 'contain';
        trash.appendChild(trashImg);

        // Posição horizontal baseada na coluna
        this.setColumnWidth();
        const left = this.currentColumn * this.columnWidth + (this.columnWidth / 2) - 20; // Centraliza o lixo na coluna
        trash.style.left = left + 'px';
        trash.style.top = '-50px';
        trash.style.transition = 'none';

        sky.appendChild(trash);

        // Remover animação CSS
        trash.style.animation = '';

        // Queda dinâmica via JS com suporte a pause
        const trashHeight = Math.min(70, window.innerWidth * 0.08); // Altura responsiva baseada na largura da tela
        const startTop = -50;
        const trashBins = document.querySelector('.trash-bins');
        const trashBinsRect = trashBins.getBoundingClientRect();
        const skyRect = sky.getBoundingClientRect();
        const endTop = trashBinsRect.top - skyRect.top - trashHeight / 2;
        const duration = this.fallSpeed;
        let startTime = null;
        let pausedAt = null;
        let animationFrameId = null;
        let isPaused = false;
        let totalPaused = 0;

        // Controle do intervalo de colisão
        let checkCollisionInterval = null;

        const animateFall = (timestamp) => {
            if (this.gamePaused) {
                isPaused = true;
                pausedAt = timestamp;
                // Pausar verificação de colisão
                if (checkCollisionInterval) {
                    clearInterval(checkCollisionInterval);
                    checkCollisionInterval = null;
                }
                return;
            }
            if (isPaused && pausedAt !== null) {
                // Corrige o startTime para compensar o tempo pausado
                totalPaused += (timestamp - pausedAt);
                isPaused = false;
                pausedAt = null;
            }
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime - totalPaused;
            const progress = Math.min(elapsed / duration, 1);
            const currentTop = startTop + (endTop - startTop) * progress;
            trash.style.top = currentTop + 'px';
            if (progress < 1 && trash.parentNode) {
                animationFrameId = requestAnimationFrame(animateFall);
                // Iniciar/reiniciar verificação de colisão se não estiver rodando
                if (!checkCollisionInterval) {
                    checkCollisionInterval = setInterval(() => {
                        if (!trash.parentNode) {
                            clearInterval(checkCollisionInterval);
                            return;
                        }
                        this.checkCollision(trash);
                    }, 100);
                }
            } else {
                // Ao final da queda, remove se não colidiu
                if (trash.parentNode) {
                    trash.remove();
                }
                if (checkCollisionInterval) {
                    clearInterval(checkCollisionInterval);
                }
            }
        };
        animationFrameId = requestAnimationFrame(animateFall);

        // Guardar referência para retomar animação ao despausar
        trash._animateFall = animateFall;
        trash._animationFrameId = animationFrameId;
        trash._startTime = () => startTime;
        trash._setStartTime = (v) => { startTime = v; };
        trash._pausedAt = () => pausedAt;
        trash._setPausedAt = (v) => { pausedAt = v; };
        trash._totalPaused = () => totalPaused;
        trash._setTotalPaused = (v) => { totalPaused = v; };
        trash._checkCollisionInterval = () => checkCollisionInterval;
        trash._setCheckCollisionInterval = (v) => { checkCollisionInterval = v; };
    }
    

    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.moveTrashLeft();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.moveTrashRight();
                break;
        }
    }
    
    loseLife() {
        this.lives--;
        this.updateHearts(); // Atualizar corações
        this.updateDisplay();
        this.checkGameOver();
    }
    
    checkGameOver() {
        if (this.lives <= 0) {
            this.endGame();
        }
    }
    
    checkLevelUp() {
        const hitsNeeded = this.level * 20; // 20 acertos por nível
        
        if (this.correctHits >= hitsNeeded && this.level < 5) {
            this.level++;
            this.fallSpeed = Math.max(1000, this.fallSpeed - 200); // Aumentar velocidade
            this.showFeedback(`🎉 Nível ${this.level}! Velocidade aumentada!`, 'levelup');
            this.updateDisplay();
        }
    }
    
    endGame() {
        this.gameRunning = false;
        
        // Limpar intervalos
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        
        // Mostrar modal de game over
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over-modal').style.display = 'block';
        
        // Desabilitar botões
        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('restart-btn').disabled = false;
    }
    
    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `feedback feedback-${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#FF9800'};
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 1000;
            animation: feedbackShow 0.5s ease;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
    
    moveTrashLeft() {
        const fallingTrash = document.querySelector('.falling-trash');
        if (fallingTrash) {
            let col = parseInt(fallingTrash.dataset.column);
            if (col > 0) {
                col--;
                fallingTrash.dataset.column = col;
                const left = col * this.columnWidth + (this.columnWidth / 2) - 20;
                fallingTrash.style.left = left + 'px';
                fallingTrash.style.transition = 'left 0.2s ease';
            }
            this.checkCollision(fallingTrash);
        }
    }
    
    moveTrashRight() {
        const fallingTrash = document.querySelector('.falling-trash');
        if (fallingTrash) {
            let col = parseInt(fallingTrash.dataset.column);
            if (col < this.gridColumns - 1) {
                col++;
                fallingTrash.dataset.column = col;
                const left = col * this.columnWidth + (this.columnWidth / 2) - 20;
                fallingTrash.style.left = left + 'px';
                fallingTrash.style.transition = 'left 0.2s ease';
            }
            this.checkCollision(fallingTrash);
        }
    }
    
    checkCollision(trash) {
        // Verificar se o lixo já foi processado
        if (trash.dataset.processed === 'true') {
            return;
        }
        
        const trashRect = trash.getBoundingClientRect();
        const bins = document.querySelectorAll('.trash-bin');
        
        bins.forEach((bin, idx) => {
            const binRect = bin.getBoundingClientRect();
            
            // Checa se o lixo está na mesma coluna da lixeira e permite uma margem de tolerância
            const margem = 15; // tolerância em pixels
            const trashBase = trashRect.bottom;
            const binTop = binRect.top;
            const binBottom = binRect.bottom;
            if (
              parseInt(trash.dataset.column) === idx &&
              trashBase >= binTop - margem && trashBase <= binBottom + margem
            ) {
                
                // Marcar como processado para evitar múltiplas detecções
                trash.dataset.processed = 'true';
                
                const trashType = trash.dataset.type;
                const correctBin = trash.dataset.correctBin;
                const binType = bin.dataset.type;
                
                // Verificar se acertou (lixo caiu na lixeira correta)
                if (binType === correctBin) {
                    this.score += 15;
                    this.correctHits++;
                    this.showFeedback('✅ Correto! +15 pontos', 'success');
                    this.checkLevelUp();
                } else {
                    this.loseLife();
                    this.showFeedback('❌ Errado! -1 vida', 'error');
                }
                
                // Remover lixo
                trash.remove();
                this.updateDisplay();
                this.checkGameOver();
            }
        });
    }
    
    initializeHearts() {
        const heartsContainer = document.getElementById('hearts-container');
        heartsContainer.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('img');
            heart.src = 'Assets/coracao_vermelho.png';
            heart.alt = 'Coração';
            heart.className = 'heart';
            heartsContainer.appendChild(heart);
        }
    }
    
    updateHearts() {
        const hearts = document.querySelectorAll('.heart');
        
        hearts.forEach((heart, index) => {
            if (index < this.lives) {
                // Corações vermelhos = vidas restantes
                heart.src = 'Assets/coracao_vermelho.png';
                heart.classList.remove('lost');
            } else {
                // Corações cinzas = vidas perdidas
                heart.src = 'Assets/coracao_cinza.png';
                heart.classList.add('lost');
            }
        });
    }
    
    // Remover todos os métodos relacionados ao giroscópio: setupGyroToggleButton, activateGyroscope, deactivateGyroscope, initGyroscope, addGyroscopeButton, requestGyroscopePermission, startGyroscope, toggleGyroscopeSpeed, showSpeedIndicator
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('hits').textContent = this.correctHits;
        
        // Calcular acertos necessários para o próximo nível
        const hitsNeeded = this.level < 5 ? this.level * 20 : 'MAX';
        document.getElementById('hits-needed').textContent = hitsNeeded;
    }

    setColumnWidth() {
        const sky = document.getElementById('sky');
        this.columnWidth = sky.offsetWidth / this.gridColumns;
    }

    // Função para recalcular tamanhos responsivos
    recalculateSizes() {
        this.setColumnWidth();
        
        // Recalcular tamanho do lixo em queda
        const fallingTrash = document.querySelectorAll('.falling-trash');
        fallingTrash.forEach(trash => {
            const trashHeight = Math.min(70, window.innerWidth * 0.08);
            const trashImg = trash.querySelector('img');
            if (trashImg) {
                trashImg.style.width = '100%';
                trashImg.style.height = '100%';
            }
        });
    }
}

// Adicionar CSS para feedback
const feedbackCSS = `
@keyframes feedbackShow {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
    }
    50% {
        transform: translate(-50%, -50%) scale(1.1);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}
`;

const style = document.createElement('style');
style.textContent = feedbackCSS;
document.head.appendChild(style);

// Inicializar jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new TrashGame();

    // Guia de Lixeiras
    const guideBtn = document.getElementById('guide-btn');
    const guideModal = document.getElementById('guide-modal');
    const closeGuideBtn = document.getElementById('close-guide-btn');
    if (guideBtn && guideModal && closeGuideBtn) {
        guideBtn.onclick = () => {
            guideModal.style.display = 'block';
        };
        closeGuideBtn.onclick = () => {
            guideModal.style.display = 'none';
        };
        // Fechar ao clicar fora do modal
        window.addEventListener('click', (e) => {
            if (e.target === guideModal) {
                guideModal.style.display = 'none';
            }
        });
    }
}); 