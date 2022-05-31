class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - this.width / 2;
        this.right = x + this.width / 2;

        const infinity = 10000000;
        this.top = -infinity;
        this.bottom = infinity;

        //Borders are given by two points because a border can be a curve
        const topLeft = { x: this.left, y: this.top };
        const topRight = { x: this.right, y: this.top };
        const bottomLeft = { x: this.left, y: this.bottom };
        const bottomRight = { x: this.right, y: this.bottom };

        //Array is used because its not necessary that there will be only two borders
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    //get Lane Center
    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + Math.min(laneIndex, this.laneCount - 1) * laneWidth + laneWidth / 2;
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        //Making lanes using linear Interpolation (Check Lerp in Utils.js)
        for (let i = 1; i <= this.laneCount - 1; i++) {
            const x = lerp(this.left, this.right, i / this.laneCount);
            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }
}
