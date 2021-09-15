//canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];
let adjustX = 5;
let adjustY = -7;

//handle mouse
const mouse = {
    x: null,
    y: null,
    radius: 70,
    radiusSquare: 490,
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

ctx.fillStyle = 'white';
ctx.font = '25px Verdana';
ctx.fillText('Hi', 0, 30);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 5;
    }
    draw(){
        if(this.x !== this.baseX || this.y !== this.baseY)ctx.fillStyle = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        else ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let accelerationX = dx / distance;
        let accelerationY = dy / distance;
        let force = 1 - distance / mouse.radius;
        let speedX = accelerationX * force * this.density;
        let speedY = accelerationY * force * this.density;
        if(distance < mouse.radius){
            this.x -= speedX;
            this.y -= speedY;
        }else {
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

function init() {
    for (let y = 0; y < textCoordinates.height; y++) {
        for(let x = 0; x < textCoordinates.width; x++){
            if(textCoordinates.data[y * 4 * textCoordinates.width + x * 4  + 3] > 128){
                let positionX = (x + adjustX) * 18;
                let positionY = (y + adjustY) * 18;
                particles.push(new Particle(positionX, positionY));
            }
        }
    }
}
init();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < particles.length; i++){
        particles[i].draw();
        particles[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

function connect() {
    for(let a = 0; a < particles.length; a++){
        for(let b = a + 1; b < particles.length; b++){
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            opacityValue = 1 - (distance / 50);
            ctx.strokeStyle = 'rgba('+ opacityValue * 255 + ',' + opacityValue * 0 + ',' + opacityValue * 210 + ',' + opacityValue + ')';
            if(distance < 50){
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}