class Car {
    //Constructor
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;

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
        this.y -= this.speed;
    }
}