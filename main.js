const canvas = document.getElementById('canvas');
//Canvas Height and Width
canvas.width = 200;
canvas.height = window.innerHeight;
//Get context to draw on canvas
const ctx = canvas.getContext('2d');
const car = new Car(100, 100, 30, 50);

//Animate the car
animate()

function animate() {
    car.update();
    car.draw(ctx);
    //requestAnimationFrame calls the animate method many times per second
    //which allows the car to move smoothly and it gives illustion of movement
    requestAnimationFrame(animate);
}