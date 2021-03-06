const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width =window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

let mouse = {
  x: null, 
  y: null, 
  radius: 100
}

window.addEventListener('mousemove', 
  function(event){
    mouse.x = event.x + canvas.clientLeft/2;
    mouse.y = event.y + canvas.clientTop/2;
  });

function drawImage(){
  let imageWidth = png.width;
  let imageHeight = png.height;
  // this is a method in the canvas 2D API that returns image data
  const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
  // we can clear the canvas and delete the actual image.
  ctx.clearRect(0,0, canvas.width, canvas.height);

  class Particle {
    constructor(x, y, color, size){
      this.x = x + canvas.width/2 - png.width *2,
      this.y = y + canvas.height/2 - png.height * 2,
      this.color = color,
      this.size = 2,
      this.baseX = x + canvas.width/2 - png.width *2,
      this.baseY = y + canvas.height/2 - png.height * 2,
      this.density = (Math.random() *10) + 2;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update(){
      ctx.fillStyle = this.color;

      //collision detection
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;

      // max distance, past that the forice will be 0
      const maxDistance = 100;
      let force = (maxDistance - distance) / maxDistance;
      if (force < 0) force = 0;

      let directionX = (forceDirectionX * force * this.density * 0.6);
      let directionY = (forceDirectionY * force * this.density * 0.6);

      if (distance < mouse.radius + this.size) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX){
          let dx = this.x - this.baseX;
          this.x -= dx/20;
        } if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy/20;
        }
      }
      this.draw()
    }
  }
    function init() {
      particleArray = [];
      for (let y = 0, y2 = data.height; y < y2; y++) {
        for (let x = 0, x2 = data.width; x < x2; x++){
          if (data.data[(y * 4 * data.width) + (x * 4) +3 ] > 128) {
            let positionX = x;
            let positionY = y;
            let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," +
                                data.data[(y * 4 * data.width) + (x * 4) + 1] + "," +
                                data.data[(y * 4 * data.width) + (x * 4) + 2] + ")" ;
            particleArray.push(new Particle(positionX * 4, positionY * 4, color));
          }
        }
      }
    }
    function animate(){
      requestAnimationFrame(animate);
      ctx.fillStyle = 'rgba(0,0,0,.05)';
      ctx.fillRect(0,0, innerWidth, innerHeight);

      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
      }
    }
    init();
    animate();

    window.addEventListener('resize',
    function() {
      canvas.width - innerWidth;
      canvas.height - innerHeight;
      init();
    });
}

const png = new Image();
png.src = "data:image/png;base64,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"

window.addEventListener('load', (event) => {
  console.log('page has loaded');
  //this is from the API
  ctx.drawImage(png, 0, 0);
  //this is the one I made
  drawImage();
});