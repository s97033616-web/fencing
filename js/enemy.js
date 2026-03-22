export class Enemy {
    constructor(x, y, color, level = 'easy') {
        this.x = x;
        this.y = y;
        this.width = 60;  // 이미지 비율에 맞춰 너비 조정
        this.height = 120; // 이미지 비율에 맞춰 높이 조정
        this.color = color;
        this.score = 0;
        this.direction = -1; // 왼쪽을 바라봄
        this.level = level;

        // 이미지 객체 생성 및 소스 설정
        this.image = new Image();
        this.image.src = 'images/2.png'; 

        // 난이도별 능력치 설정
        this.speed = (level === 'hard') ? 4.5 : 3.5;
        this.cooldownTime = (level === 'hard') ? 400 : 800;
        
        this.swordLength = 70; // 이미지 크기에 맞춰 칼 길이 약간 수정
        this.isAttacking = false;
        this.canAttack = true;
        this.attackDuration = 100;

        // AI 지능형 변수 (Hard 전용)
        this.stateTimer = 0;
        this.targetDist = 100;
    }

    update(player) {
        // 플레이어와의 거리 계산 (이미지 너비 고려)
        const dist = Math.abs(this.x - (player.x + player.width));

        if (this.level === 'hard') {
            // --- Alpha-Fencer 로직 (고성능 AI) ---
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
                // 상대가 공격 중일 때 카운터 혹은 거리 좁혀졌을 때 확률적 공격
                if (player.isAttacking && dist < 80 && Math.random() > 0.3) this.startAttack();
                else if (dist < 75 && Math.random() > 0.92) this.startAttack();
            }
        } else {
            // --- Novice-Bot 로직 (단순 AI) ---
            if (dist > 80) this.x -= this.speed;
            else if (dist < 70) this.x += this.speed;

            if (this.canAttack && dist < 85 && Math.random() > 0.98) {
                this.startAttack();
            }
        }
    }

    startAttack() {
        this.isAttacking = true;
        this.canAttack = false;
        // 공격 판정 지속 시간 및 쿨타임 설정
        setTimeout(() => { this.isAttacking = false; }, this.attackDuration);
        setTimeout(() => { this.canAttack = true; }, this.attackDuration + this.cooldownTime);
    }

    draw(ctx) {
        ctx.save();
        
        // 쿨타임 중일 때는 약간 투명하게 표시하여 상태 전달
        ctx.globalAlpha = this.canAttack ? 1.0 : 0.7;
        
        // 캐릭터 이미지 그리기
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // 이미지 로딩 전 대비용 사각형
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        // 공격 시 칼날 효과 (붉은 선)
        if (this.isAttacking) {
            const currentSword = this.swordLength;
            ctx.strokeStyle = '#ff3300';
            ctx.lineWidth = 4;
            ctx.beginPath();
            // 이미지 내 캐릭터의 손 위치(this.y + 60 부근)에서 칼이 나가도록 설정
            const swordStartX = this.x + 10; 
            ctx.moveTo(swordStartX, this.y + 60);
            ctx.lineTo(swordStartX - currentSword, this.y + 60);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}
