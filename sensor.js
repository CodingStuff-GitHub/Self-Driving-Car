class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 3;
        this.rayLimit = 100; //Sensors work to certain limit
        this.raySpread = Math.PI / 4; //45 degrees angle

        this.rays = [];
        //How far is the border by using rays
        this.readings = [];
    }
    update(roadBorders) {
        this.#castRays();
        this.readings = [];
        for (var i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders)
            );
        }
    }

    #getReading(ray, roadBorders) {
        //where the ray touches any border
        let touches = [];
        for (var i = 0; i < roadBorders.length; i++) {
            //getInteraction is a utli.js function which returns
            //x, y : intersection point between two lines ray and border
            //offset : offset from center of the car i.e starting point of the ray
            const touch = getIntersection(
                ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]
            );
            if (touch) {
                touches.push(touch);
            }
        }

        if (touches.length == 0) {
            return null;
        }
        else {
            //Go through all the elements of the array touches
            //and for each element of the array it takes offset value
            //and it returns new array with offset values
            const offsets = touches.map(e => e.offset);
            //Math.min doesn't work with arrays'
            //It wants multiple elements. So, spreading it using ...
            const minOffset = Math.min(...offsets)
            return touches.find(e => e.offset == minOffset);
        }
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
            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i];
            }
            //Yellow segment
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            //black segment
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
}