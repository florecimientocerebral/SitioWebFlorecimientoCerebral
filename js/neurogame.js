/**
 * FLORECIMIENTO CEREBRAL - NEURO-DESAFÍO CUADRI-COLOR
 * Un mini-juego cognitivo interactivo inspirado en NeuroCuadriColor™
 * Mide velocidad psicomotora, atención selectiva y agilidad mental.
 */

class NeuroGame {
  constructor() {
    this.score = 0;
    this.streak = 0;
    this.timeLeft = 25;
    this.isPlaying = false;
    this.timerInterval = null;
    this.currentTarget = null;
    this.startTime = null;
    this.reactionTimes = [];

    // Colors data
    this.colors = [
      { id: 'yellow', name: 'AMARILLO', hex: '#ffb703', class: 'quad-yellow' },
      { id: 'blue',   name: 'AZUL',     hex: '#0284c7', class: 'quad-blue' },
      { id: 'red',    name: 'ROJO',     hex: '#e11d48', class: 'quad-red' },
      { id: 'green',  name: 'VERDE',    hex: '#10b981', class: 'quad-green' }
    ];

    // Audio Context for sound synthesis
    this.audioCtx = null;

    // DOM Elements
    this.btnStart = document.getElementById('start-neurogame-btn');
    this.scoreDisplay = document.getElementById('game-score-display');
    this.timerDisplay = document.getElementById('game-timer-display');
    this.streakDisplay = document.getElementById('game-streak-display');
    this.statusMsg = document.getElementById('game-status-msg');
    this.targetPrompt = document.getElementById('game-target-prompt');
    this.boardButtons = document.querySelectorAll('.quadrant-btn');

    this.init();
  }

  init() {
    if (!this.btnStart) return;

    this.btnStart.addEventListener('click', () => {
      this.initAudio();
      if (!this.isPlaying) {
        this.startGame();
      } else {
        this.stopGame();
      }
    });

    this.boardButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const colorId = e.currentTarget.dataset.color;
        this.handleColorClick(colorId, e.currentTarget);
      });
    });
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  playBeep(freq, type = 'sine', duration = 0.12) {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (err) {
      // Audio context may be restricted
    }
  }

  startGame() {
    this.isPlaying = true;
    this.score = 0;
    this.streak = 0;
    this.timeLeft = 25;
    this.reactionTimes = [];

    this.updateUI();
    this.btnStart.textContent = 'Reiniciar Desafío';
    this.btnStart.classList.add('btn-secondary');
    this.btnStart.classList.remove('btn-cyan');

    this.statusMsg.textContent = '¡Rápido! Conecta tu sinapsis con el color indicado:';
    this.nextRound();

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.timerDisplay.textContent = `${this.timeLeft}s`;

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  nextRound() {
    if (!this.isPlaying) return;

    // Pick random target color
    const targetIdx = Math.floor(Math.random() * this.colors.length);
    this.currentTarget = this.colors[targetIdx];

    // Pick display text (color name or Stroop color trick)
    const textIdx = Math.random() > 0.4 ? Math.floor(Math.random() * this.colors.length) : targetIdx;
    const displayText = this.colors[textIdx].name;

    this.targetPrompt.textContent = displayText;
    this.targetPrompt.style.color = this.currentTarget.hex;
    this.targetPrompt.style.transform = 'scale(1.15)';
    setTimeout(() => {
      this.targetPrompt.style.transform = 'scale(1)';
    }, 150);

    this.startTime = performance.now();
  }

  handleColorClick(clickedColor, element) {
    if (!this.isPlaying || !this.currentTarget) return;

    const reactionTime = Math.round(performance.now() - this.startTime);
    this.reactionTimes.push(reactionTime);

    if (clickedColor === this.currentTarget.id) {
      // Correct!
      this.streak++;
      const speedBonus = Math.max(10, Math.floor((1000 - reactionTime) / 10));
      const points = 100 + speedBonus + (this.streak * 15);
      this.score += points;

      this.playBeep(520 + (this.streak * 30), 'sine', 0.1);
      this.statusMsg.innerHTML = `<span style="color: var(--color-green);">✓ ¡Exacto! (${reactionTime} ms) +${points} pts</span>`;
      
      // Flash quadrant
      element.classList.add(`quad-flash-${clickedColor}`);
      setTimeout(() => element.classList.remove(`quad-flash-${clickedColor}`), 350);

      this.updateUI();
      this.nextRound();
    } else {
      // Mistake
      this.streak = 0;
      this.playBeep(220, 'sawtooth', 0.2);
      this.statusMsg.innerHTML = `<span style="color: var(--color-pink);">✗ ¡Distracción sensorial! Era ${this.currentTarget.name}</span>`;
      this.updateUI();
      this.nextRound();
    }
  }

  updateUI() {
    this.scoreDisplay.textContent = this.score;
    this.streakDisplay.textContent = `x${this.streak}`;
    this.timerDisplay.textContent = `${this.timeLeft}s`;
  }

  stopGame() {
    clearInterval(this.timerInterval);
    this.isPlaying = false;
    this.btnStart.textContent = 'Iniciar Neuro-Desafío';
    this.btnStart.classList.add('btn-cyan');
    this.btnStart.classList.remove('btn-secondary');
  }

  endGame() {
    this.stopGame();
    this.playBeep(660, 'triangle', 0.4);

    const avgReaction = this.reactionTimes.length > 0 
      ? Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length) 
      : 0;

    let diagnosis = '';
    let authorQuote = '';

    if (this.score >= 2500) {
      diagnosis = 'Nivel: Neuroplasticidad Suprema';
      authorQuote = 'docSERsol: "¡Asombroso! Tus circuitos neuronales exhiben una velocidad de procesamiento excepcional y control ejecutivo de élite."';
    } else if (this.score >= 1400) {
      diagnosis = 'Nivel: Sinapsis Veloz';
      authorQuote = 'docSERsol: "Excelente agilidad psicomotora. Con el juego continuo en NeuroCuadriColor™ desbloquearás aún más capacidades latentes."';
    } else {
      diagnosis = 'Nivel: Estimulación Requerida';
      authorQuote = 'Dr. Neuro Tóxix: "¡Caramba! Tus neuronas necesitan urgente una dosis de PDNT y una partida en familia de Enloquézcase de la Risa."';
    }

    this.targetPrompt.textContent = '¡TIEMPO!';
    this.targetPrompt.style.color = 'var(--color-pink)';
    
    this.statusMsg.innerHTML = `
      <div style="background: rgba(0,0,0,0.5); padding: 1.25rem; border-radius: 12px; margin-top: 1rem; border: 1px solid var(--border-glow);">
        <h4 style="color: var(--color-cyan); margin-bottom: 0.5rem;">${diagnosis}</h4>
        <p style="color: #fff; margin-bottom: 0.5rem; font-size: 1.05rem;">Puntaje Final: <strong>${this.score} pts</strong> | Reacción promedio: <strong>${avgReaction} ms</strong></p>
        <p style="font-style: italic; color: #fce7f3; font-size: 0.95rem;">${authorQuote}</p>
      </div>
    `;
  }
}

// Auto-initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  window.neuroGameInstance = new NeuroGame();
});
