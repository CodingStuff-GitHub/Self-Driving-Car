class Car {
    //Constructor
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.damage = false;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;

        this.brain = controlType == "AI"

        this.angle = 0;

        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4, 3]
            )
        }
        this.controls = new Controls(controlType);
    }

    //Update the car and the sensors
    update(roadBorders, traffic) {
        if (!this.damage) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damage = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            //If object is far away, we need less values and vice versa.
            //That is the reason why we are subtracting offset from 1
            const offsets = this.sensor.readings.map(
                s => s == null ? 0 : 1 - s.offset
            );
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            if (this.brain) {
                //this.controls.forward = outputs[0];
                this.controls.forward = true;
                this.controls.left = outputs[0];
                this.controls.right = outputs[1];
                this.controls.reverse = outputs[2];
            }
        }
    }

    //To check of the car is damage or not
    #assessDamage(roadBorders, traffic) {
        //Check if the polygon is intersecting with any borders
        for (let i = 0; i < roadBorders.length; i++) {
            //utils.js function
            if (polysIntersection(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersection(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    //Create Polygon of the car which will help to detect collisions
    #createPolygon() {
        const points = [];
        //This gives the hypotenuse of the triangle whose sides are width height and half of diagonal
        //radius = that half of diagonal
        const radius = Math.hypot(this.width, this.height) / 2;
        //this is the angle between the width and the height of the car
        const alpha = Math.atan2(this.width, this.height);
        //Subtracting the this.angle from alpha because if the car turns left or right
        //this.angle will tell the change and we should see the corner points relative to that 
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * radius,
            y: this.y - Math.cos(this.angle - alpha) * radius
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * radius,
            y: this.y - Math.cos(this.angle + alpha) * radius
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius
        });
        return points;
    }

    //Controls of the car
    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        //Capping the speed to the maxSpeed
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        //Capping the reverse speed to half because reverse is slower than forward
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }
        //Adding friction so that car stops after slowing down
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        //This function is to stop moving the car when the speed is 0.something
        //Friction is bouncing it in above two functions
        //and adding some small speed to the car
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
        //Left and Right movement
        if (this.speed != 0) {
            //Fliping the control when it is reversed
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }
        //Subtracting sin and cos of the angle from the x and y 
        //to move in that particular direction
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    //Draw the car
    draw(ctx, colour, drawSensor = false) {
        if (this.damage) {
            ctx.fillStyle = "gray";
        }
        else {
            ctx.fillStyle = colour;
        }
        ctx.beginPath();
        //polygon array have all the points to draw a polygon
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (var i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }
    }
}