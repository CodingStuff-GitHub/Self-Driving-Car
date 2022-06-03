const canvas = document.getElementById('canvas');
//Canvas Height and Width
canvas.width = 200;
//canvas.height = window.innerHeight;

//Get context to draw on canvas
const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
//KEYS is used for giving control of keys to this particular car
const N = 10;
const cars = generateCars(N);
const traffic = generateTraffic(100);
let bestCar = cars[0];
//Already trainedBrain is added to the car
sampletrainedBrain();

if (localStorage.getItem("BestBrain")) {
    bestCar.brain = JSON.parse(localStorage.getItem("BestBrain"));
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("BestBrain"));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

//Animate the car
animate();
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
        cars.push(new Car(road.getLaneCenter(Math.floor(Math.random() * 3)), 100, 30, 50, "AI"));
    }
    return cars;
}

//Generate N cars
function generateTraffic(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(Math.floor(Math.random() * 3)), (-150 * i), 30, 50, "DUMMY", 2));
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
    checkDamage();
    ctx.globalAlpha = 1;
    bestCar.draw(ctx, "blue", true);
    ctx.restore();

    //requestAnimationFrame calls the animate method many times per second
    //which allows the car to move smoothly and it gives illustion of movement
    requestAnimationFrame(animate);

}

function checkDamage() {
    for (let i = 0; i < cars.length; i++) {
        //Check if the car.damage is true
        if (!cars[i].damage) {
            return true;
        }
    }
    save();
    window.location.reload();
}

function sampletrainedBrain() {
    localStorage.setItem("BestBrain", "{\"levels\":[{\"inputs\":[0,1,1,0,0],\"outputs\":[1,1,0,0,1,0],\"biases\":[0.09897519031859515,-0.2531174806675848,-0.27733877888620223,0.23406435141340304,0.2574158143965888,-0.27100696426943743],\"weights\":[[0.15486583308105223,-0.17714240525198297,-0.5870101981832158,0.2927049849434276,0.3698050610826309,-0.02275995262378798],[0.038824466147479975,-0.2548575115318535,-0.5378443163672029,-0.2227977107476418,0.6928254116839792,-0.12220062259596168],[0.33346366658605026,0.26753086124632436,-0.0035510438981323153,0.20574860842580273,0.040665629518559315,-0.27564760956056716],[0.41497389761179987,-0.2518987097007724,-0.18036101979158273,-0.0008462674634980294,-0.4631330235416366,0.3741087676150945],[-0.14316494463672655,-0.4217737976893303,0.3118109022783214,0.1611554420694621,-0.3221510542701283,0.45778307709309574]]},{\"inputs\":[1,1,0,0,1,0],\"outputs\":[1,1,0,1],\"biases\":[0.32936030512094233,-0.37589431498739007,0.018553702347420827,0.3969650336101469],\"weights\":[[-0.22021364774968114,-0.25266527351078094,-0.22397543672996595,0.042653899616720406],[0.45964100154044707,0.43559139822936194,0.26404182343586813,0.37456635811545685],[0.47269547141065466,0.5315126381496087,-0.3354374497185732,0.19737061860330204],[-0.42904590187471336,0.5153474674111878,0.16391722537132403,0.21556711495515296],[0.09136801114767808,0.6570367535825011,-0.1830542180796609,0.24773194078752692],[-0.2762218266795413,-0.03530273900359113,-0.45966745383960295,0.5185404312094688]]},{\"inputs\":[1,1,0,1],\"outputs\":[0,0],\"biases\":[0.10587293339295417,0.5977675003683705],\"weights\":[[-0.04002422700404275,-0.5835767471287483],[0.212969307162079,0.10118933159173697],[0.416910784749758,-0.13158023916707132],[-0.4058817033123823,0.6009134694510372]]}]}");
}
