const canvas = document.getElementById('canvas');
//Canvas Height and Width
canvas.width = 200;
//canvas.height = window.innerHeight;

//Get context to draw on canvas
const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
//KEYS is used for giving control of keys to this particular car
const N = 100;
const cars = generateCars(N);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(3), -400, 30, 50, "DUMMY", 2)
];
let bestCar = cars[0];
if (localStorage.getItem("BestBrain")) {
    bestCar.brain = JSON.parse(localStorage.getItem("BestBrain"));
}

//Animate the car
animate()

function save() {
    localStorage.setItem("BestBrain", JSON.stringify(
        bestCar.brain
    ));
}

function discard() {
    localStorage.removeItem("BestBrain");
}

//Generate N cars
function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate() {
    //Updating Traffic
    for (let i = 0; i < traffic.length; i++) {
        //Empty traffic for other cars so that they dont interact with each other and get damaged
        //We can add our car to stop the traffic car in the traffic array
        traffic[i].update(road.borders, []);
    }

    //Send borders for sensors to know where they are
    //Sending traffic to see other cars
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    //Focusing on the best car which y value is minimum
    //Create a new array of y values of cars and then find minimum and 
    //then find the car which is the minimum
    bestCar = cars.find(
        car => car.y == Math.min(
            ...cars.map(car => car.y)
        ));

    //Refresh the canvas everytime and it clears it again
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -bestCar.y + canvas.height * 0.8);

    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx, "red");
    }
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(ctx, "blue");
    }
    ctx.globalAlpha = 1;
    bestCar.draw(ctx, "green", true);
    ctx.restore();

    //requestAnimationFrame calls the animate method many times per second
    //which allows the car to move smoothly and it gives illustion of movement
    requestAnimationFrame(animate);
}