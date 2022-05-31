class Car {
    //Constructor
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;

        this.angle = 0;

        this.controls = new Controls();
    }

    //Update the car
    update() {
        this.#move();
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
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.rect(-this.width / 2,
            -this.height / 2,
            this.width,
            this.height);
        ctx.fill();
        ctx.restore();
    }
}