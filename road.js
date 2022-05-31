class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - this.width / 2;
        this.right = x + this.width / 2;

        const infinity = 10000000;
        this.top = -infinity;
        this.bottom = infinity
    }

    //get Lane Center
    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + Math.min(laneIndex, this.laneCount - 1) * laneWidth + laneWidth / 2;
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        //Making lanes using linear Interpolation
        for (let i = 0; i <= this.laneCount; i++) {
            const x = lerp(this.left, this.right, i / this.laneCount);
            if (i > 0 && i < this.laneCount) {
                ctx.setLineDash([20, 20]);
            }
            else {
                ctx.setLineDash([]);
            }
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
    }
}
