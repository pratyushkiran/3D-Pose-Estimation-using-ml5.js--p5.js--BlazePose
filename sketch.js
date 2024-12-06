function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

}

function draw() {
  background(220);
}
