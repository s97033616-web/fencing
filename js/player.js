export class Player {
    constructor(x, y, color, controls, direction) {
        this.x = x;
        this.y = y;
        this.width = 60;  // 이미지 비율에 맞춰 조정
        this.height = 120; 
        this.color = color;
        this.controls = controls;
        this.direction = direction;
        
        // 이미지 로드
        this.image = new Image();
        this.image.src = 'images/1.png'; // 플레이어 이미지

        this.speed = 5;
        this.swordLength = 70;
        this.isAttacking = false;
        this.canAttack = true;
        this.attackDuration = 100;
        this.cooldownTime = 400;
    }

    update(input, canvasWidth) {
        // 이동 로직
        if (input.isPressed(this.controls.left)) this.x -= this.speed;
        if (input.isPressed(this.controls.right)) this.x += this.speed;
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));

        // 공격 로직 (Space)
        if (input.isPressed(this.controls.attack) && this.canAttack) {
            this.startAttack();
        }
    }

    startAttack() {
        this.isAttacking = true;
        this.canAttack = false;

        setTimeout(() => {
            this.isAttacking = false;
        }, this.attackDuration);

        setTimeout(() => {
            this.canAttack = true;
        }, this.attackDuration + this.cooldownTime);
    }

    draw(ctx) {
        // 캐릭터 이미지 그리기
        ctx.save();
        ctx.globalAlpha = this.canAttack ? 1.0 : 0.6;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();

        // 칼 (공격 시 시각 효과)
        if (this.isAttacking) {
            ctx.strokeStyle = '#ff3300';
            ctx.lineWidth = 4;
            ctx.beginPath();
            const swordStartX = this.x + this.width - 10; // 이미지 손 위치에 맞게 조정
            ctx.moveTo(swordStartX, this.y + 60);
            ctx.lineTo(swordStartX + this.swordLength, this.y + 60);
            ctx.stroke();
        }
    }
}
