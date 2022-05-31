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

        this.controls = new Controls();
    }

    //Draw the car
    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height);
        ctx.fill();
    }

    //Update the car
    update() {
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
        this.y -= this.speed;
    }
}