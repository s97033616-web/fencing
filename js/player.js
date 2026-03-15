export class Player {
    constructor(x, y, color, controls, direction) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 80;
        this.color = color;
        this.controls = controls; // { left: 'KeyA', right: 'KeyD', attack: 'Space' }
        this.direction = direction;
        
        this.speed = 5;
        this.swordLength = 60;

        // 공격 관련 속성만 유지
        this.isAttacking = false;
        this.canAttack = true;
        this.attackDuration = 100; // 0.1초 공격
        this.cooldownTime = 400;   // 0.4초 쿨타임
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
        // 몸체
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.canAttack ? 1.0 : 0.6; // 쿨타임 시 반투명
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1.0;

        // 칼 (항상 가로 방향)
        const currentSword = this.isAttacking ? this.swordLength : 15;
        ctx.strokeStyle = this.isAttacking ? '#ff3300' : '#333';
        ctx.lineWidth = 4;
        ctx.beginPath();
        const swordStartX = this.direction === 1 ? this.x + this.width : this.x;
        ctx.moveTo(swordStartX, this.y + 30);
        ctx.lineTo(swordStartX + (currentSword * this.direction), this.y + 30);
        ctx.stroke();
    }
}