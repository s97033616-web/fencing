export function checkHit(p1, p2) {
    let p1Wins = false;
    let p2Wins = false;

    const swordY = p1.y + 30; // 칼의 높이는 동일

    // Player 1 공격 체크 (오른쪽 방향)
    if (p1.isAttacking) {
        const swordStartX = p1.x + p1.width;
        const swordEndX = swordStartX + p1.swordLength;
        
        // 칼날의 범위 [swordStartX, swordEndX]가 
        // 상대 몸통 범위 [p2.x, p2.x + p2.width]와 겹치는지 확인
        const hitX = swordEndX >= p2.x && swordStartX <= p2.x + p2.width;
        const hitY = swordY >= p2.y && swordY <= p2.y + p2.height;

        if (hitX && hitY) p1Wins = true;
    }

    // Player 2 공격 체크 (왼쪽 방향)
    if (p2.isAttacking) {
        const swordStartX = p2.x;
        const swordEndX = swordStartX - p2.swordLength;
        
        // 왼쪽 방향이므로 min, max를 고려하여 범위 체크
        const leftEdge = Math.min(swordStartX, swordEndX);
        const rightEdge = Math.max(swordStartX, swordEndX);
        
        const hitX = rightEdge >= p1.x && leftEdge <= p1.x + p1.width;
        const hitY = swordY >= p1.y && swordY <= p1.y + p1.height;

        if (hitX && hitY) p2Wins = true;
    }

    if (p1Wins && p2Wins) return "DOUBLE";
    if (p1Wins) return 1;
    if (p2Wins) return 2;
    return 0;
}