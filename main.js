const canvas = document.getElementById('canvas');
//Canvas Height and Width
canvas.width = 200;
//canvas.height = window.innerHeight;

//Get context to draw on canvas
const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
//KEYS is used for giving control of keys to this particular car
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
];

//Animate the car
animate()

function animate() {
    //Updating Traffic
    for (let i = 0; i < traffic.length; i++) {
        //Empty traffic for other cars so that they dont interact with each other and get damaged
        //We can add our car to stop the traffic car in the traffic array
        traffic[i].update(road.borders, []);
    }

    //Send borders for sensors to know where they are
    //Sending traffic to see other cars
    car.update(road.borders, traffic);

    //Refresh the canvas everytime and it clears it again
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.8);

    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx, "red");
    }
    car.draw(ctx, "blue");

    ctx.restore();

    //requestAnimationFrame calls the animate method many times per second
    //which allows the car to move smoothly and it gives illustion of movement
    requestAnimationFrame(animate);
}