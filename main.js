const canvas = document.getElementById('canvas');
//Canvas Height and Width
canvas.width = 200;
canvas.height = window.innerHeight;
//Get context to draw on canvas
const ctx = canvas.getContext('2d');
const car = new Car(100, 100, 30, 50);
//Add car to the canvas
car.draw(ctx);