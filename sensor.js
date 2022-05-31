class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 3;
        this.rayLimit = 100; //Sensors work to certain limit
        this.raySpread = Math.PI / 4; //45 degrees angle

        this.rays = [];
    }
    update(roadBorders) {
        this.#castRays();
    }

    #castRays() {

        this.rays = [];

        for (let i = 0; i < this.rayCount; i++) {
            //Using lerp to divide equally
            //Adding car angle to angle of ray to rotate it with car
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1))
                + this.car.angle;

            //Starting point of rays is the car location
            const start = { x: this.car.x, y: this.car.y };
            //Ending at an angle and length of rayLimit
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLimit,
                y: this.car.y - Math.cos(rayAngle) * this.rayLimit
            };
            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.stroke();
        }
    }
}