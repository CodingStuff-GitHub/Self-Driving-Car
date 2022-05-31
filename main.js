const canvas = document.getElementById('canvas');
//Canvas Height and Width
canvas.width = 200;
//canvas.height = window.innerHeight;

//Get context to draw on canvas
const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

//Animate the car
animate()

function animate() {
    //Send borders for sensors to know where they are
    car.update(road.borders);
    
    //Refresh the canvas everytime and it clears it again
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.8);

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();

    //requestAnimationFrame calls the animate method many times per second
    //which allows the car to move smoothly and it gives illustion of movement
    requestAnimationFrame(animate);
}