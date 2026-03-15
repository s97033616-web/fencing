import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { InputHandler } from './input.js';
import { checkHit } from './battle.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const lobbyLayer = document.getElementById('lobby-layer');
const uiLayer = document.getElementById('ui-layer');
const readyLayer = document.getElementById('ready-layer');
const startBtn = document.getElementById('start-game-btn');
const nicknameInput = document.getElementById('nickname-input');
const diffBtns = document.querySelectorAll('.diff-btn');

const winText = document.getElementById('winner-text');
const roundText = document.getElementById('round-result-text');
const aiStatusText = document.getElementById('ai-ready-status');
const retryBtn = document.getElementById('play-again-btn');
const readyBtn = document.getElementById('ready-btn');
const restartHint = document.getElementById('restart-hint');

const input = new InputHandler();
const WIN_SCORE = 15;
let p1, ai, isGameOver = false;
let isWaitingReady = false;
let p1Ready = false;
let aiReady = false;

let p1Name = "Player";
let aiName = "Novice-Bot"; 
let selectedLevel = 'easy';

// 난이도 버튼 클릭 이벤트
diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        diffBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedLevel = btn.dataset.level;
        aiName = (selectedLevel === 'hard') ? "Alpha-Fencer" : "Novice-Bot";
    });
});

function init(fullReset = false) {
    if (fullReset || !p1) {
        p1 = new Player(100, 250, '#3498db', { left: 'KeyA', right: 'KeyD', attack: 'Space' }, 1);
        ai = new Enemy(660, 250, '#e74c3c', selectedLevel); // 선택한 난이도 적용
        p1.score = 0;
        ai.score = 0;
    } else {
        p1.x = 100;
        ai.x = 660;
        p1.isAttacking = false;
        ai.isAttacking = false;
    }

    isGameOver = false;
    isWaitingReady = false;
    p1Ready = false;
    aiReady = false;
    
    uiLayer.style.display = 'none';
    readyLayer.style.display = 'none';
    lobbyLayer.style.display = 'none'; 
}

startBtn.addEventListener('click', () => {
    const val = nicknameInput.value.trim();
    if (val) p1Name = val;
    init(true);
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (isGameOver) return; 
        if (isWaitingReady && !p1Ready) handleReadyClick();
    }
});

function handleReadyClick() {
    p1Ready = true;
    readyBtn.style.background = "#95a5a6";
    readyBtn.innerText = "WAITING FOR AI...";
    checkAllReady();
}

readyBtn.addEventListener('click', handleReadyClick);
retryBtn.addEventListener('click', () => location.reload());

function handlePoint(result) {
    if (result === 1) p1.score++;
    else if (result === 2) ai.score++;

    if (p1.score >= WIN_SCORE || ai.score >= WIN_SCORE) endGame();
    else startReadyPhase(result);
}

function startReadyPhase(winner) {
    isWaitingReady = true;
    readyLayer.style.display = 'flex';
    roundText.innerText = winner === 1 ? `${p1Name} 득점!` : `${aiName} 득점!`;
    readyBtn.style.background = "#2ecc71";
    readyBtn.innerText = "READY (Space)";
    aiStatusText.innerText = `${aiName}가 준비 중입니다...`;
    
    setTimeout(() => {
        aiReady = true;
        aiStatusText.innerText = `${aiName} 준비 완료!`;
        checkAllReady();
    }, 800 + Math.random() * 800);
}

function checkAllReady() {
    if (p1Ready && aiReady) init(false);
}

function update() {
    if (!p1 || !ai || lobbyLayer.style.display !== 'none' || isGameOver || isWaitingReady) return;

    p1.update(input, canvas.width);
    ai.update(p1);

    if (p1.x + p1.width > ai.x) {
        const overlap = (p1.x + p1.width) - ai.x;
        p1.x -= overlap / 2;
        ai.x += overlap / 2;
    }
    p1.x = Math.max(0, Math.min(p1.x, canvas.width - p1.width));
    ai.x = Math.max(0, Math.min(ai.x, canvas.width - ai.width));

    const result = checkHit(p1, ai);
    if (result !== 0) handlePoint(result);
}

function endGame() {
    isGameOver = true;
    uiLayer.style.display = 'flex';
    
    // 승자 이름과 최종 스코어를 함께 표시
    if (p1.score >= WIN_SCORE) {
        winText.innerText = `${p1Name} 최종 승리!\n(${p1.score} : ${ai.score})`;
        winText.style.color = "#3498db";
    } else {
        winText.innerText = `${aiName} 최종 승리!\n(${ai.score} : ${p1.score})`;
        winText.style.color = "#e74c3c";
    }

    // 마우스 클릭 안내
    if (restartHint) {
        restartHint.innerText = "Click 'Play Again' to Restart";
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!p1 || !ai) return;

    ctx.fillStyle = "#333";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${p1Name}: ${p1.score}`, 50, 50);
    ctx.textAlign = "right";
    ctx.fillText(`${aiName}: ${ai.score}`, 750, 50);

    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 330); ctx.lineTo(800, 330); ctx.stroke();
    
    p1.draw(ctx);
    ai.draw(ctx);
}

function gameLoop() {
    update(); draw();
    requestAnimationFrame(gameLoop);
}

lobbyLayer.style.display = 'flex';
gameLoop();