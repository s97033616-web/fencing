export class Enemy {
    constructor(x, y, color, level = 'easy') {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 80;
        this.color = color;
        this.score = 0;
        this.direction = -1;
        this.level = level; // 'easy' 또는 'hard'

        // 난이도별 능력치 설정
        this.speed = (level === 'hard') ? 4.5 : 3.5;
        this.cooldownTime = (level === 'hard') ? 400 : 800;
        
        this.swordLength = 60;
        this.isAttacking = false;
        this.canAttack = true;
        this.attackDuration = 100;

        // 지능형 변수 (Hard 전용)
        this.stateTimer = 0;
        this.targetDist = 100;
    }

    update(player) {
        const dist = Math.abs(this.x - (player.x + player.width));

        if (this.level === 'hard') {
            // --- Alpha-Fencer 로직 (기존 고성능 AI) ---
            this.stateTimer--;
            if (this.stateTimer <= 0) {
                const rand = Math.random();
                if (rand < 0.4) this.targetDist = Math.random() * 40 + 30;
                else if (rand < 0.8) this.targetDist = Math.random() * 50 + 120;
                else this.targetDist = 80;
                this.stateTimer = Math.random() * 60 + 30;
            }

            if (dist > this.targetDist + 5) this.x -= this.speed;
            else if (dist < this.targetDist - 5) this.x += this.speed;

            if (this.canAttack && !this.isAttacking) {
                if (player.isAttacking && dist < 80 && Math.random() > 0.3) this.startAttack();
                else if (dist < 70 && Math.random() > 0.92) this.startAttack();
            }
        } else {
            // --- Novice-Bot 로직 (초기 단순 AI) ---
            if (dist > 70) this.x -= this.speed;
            else if (dist < 60) this.x += this.speed;

            if (this.canAttack && dist < 75 && Math.random() > 0.98) {
                this.startAttack();
            }
        }
    }

    startAttack() {
        this.isAttacking = true;
        this.canAttack = false;
        setTimeout(() => { this.isAttacking = false; }, this.attackDuration);
        setTimeout(() => { this.canAttack = true; }, this.attackDuration + this.cooldownTime);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.canAttack ? 1.0 : 0.6;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1.0;

        const currentSword = this.isAttacking ? this.swordLength : 15;
        ctx.strokeStyle = this.isAttacking ? '#ff3300' : '#333';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 30);
        ctx.lineTo(this.x - currentSword, this.y + 30);
        ctx.stroke();
    }
}