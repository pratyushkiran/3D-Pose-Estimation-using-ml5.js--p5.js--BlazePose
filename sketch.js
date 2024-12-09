let video;
let bodyPose;
let connections;
let poses = [];
let lerpPoints;
let angle = 0;

function preload() {
  bodyPose = ml5.bodyPose("BlazePose");
  heartModel = loadModel('realistic_heart.obj'); // Replace with the path to your model

}

function gotPoses(results) {
  poses = results;
}

function setup() {
  createCanvas(640, 360, WEBGL);
  video = createCapture(VIDEO, {flipped: true})
  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();
}

function draw() {
  scale(height / 2);
  orbitControl();
  background(0);

  // Turn on the lights.
  lights();

  if (poses.length > 0) {
    let pose = poses[0];

    if (!lerpPoints) {
      lerpPoints = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        lerpPoints[i] = createVector();
      }
    }

    // keypoints
    for (let i = 0; i < pose.keypoints.length; i++) {
      let keypoint = pose.keypoints3D[i];
      let lerpPoint = lerpPoints[i];
      let amt = 0.1;
      lerpPoint.x = lerp(lerpPoint.x, keypoint.x, amt);
      lerpPoint.y = lerp(lerpPoint.y, keypoint.y, amt);
      lerpPoint.z = lerp(lerpPoint.z, keypoint.z, amt);

      stroke(255, 0, 255);
      strokeWeight(8);
      if (keypoint.confidence > 0.3) {
        push();
        translate(lerpPoint.x, lerpPoint.y, lerpPoint.z);
        point(0, 0);
        pop();
      }
    }

    // connecting lines
    for (let i = 0; i < connections.length; i++) {
      let connection = connections[i];
      let a = connection[0];
      let b = connection[1];
      let keyPointA = pose.keypoints3D[a];
      let keyPointB = pose.keypoints3D[b];
      let lerpPointA = lerpPoints[a];
      let lerpPointB = lerpPoints[b];

      let confA = keyPointA.confidence;
      let confB = keyPointB.confidence;

      stroke(0, 255, 255);
      strokeWeight(4);
      if (confA > 0.1 && confB > 0.1) {
        beginShape();
        vertex(lerpPointA.x, lerpPointA.y, lerpPointA.z);
        vertex(lerpPointB.x, lerpPointB.y, lerpPointB.z);
        endShape();
      }
    }

    // Spawn a 3D heart model at the heart position
    let leftShoulder = pose.keypoints3D[11]; // Left shoulder keypoint
    let rightShoulder = pose.keypoints3D[12]; // Right shoulder keypoint

    if (leftShoulder.confidence > 0.3 && rightShoulder.confidence > 0.3) {
      let heartX = (lerpPoints[11].x + lerpPoints[12].x) / 2 - 0.05;
      let heartY = (lerpPoints[11].y + lerpPoints[12].y) / 2 + 0.15; // Slightly below the midpoint
      let heartZ = (lerpPoints[11].z + lerpPoints[12].z) / 2;

      push();

      translate(heartX, heartY, heartZ);
      scale(0.1); // Reduce the size of the model (adjust the scale factor as needed)

      rotateX(PI); // Rotate the model to correct the upside-down orientation
     
      fill(255, 0, 0);
      noStroke();
      // sphere(0.05); // Replace with your 3D heart model if available
      model(heartModel);
      pop();
    }
  }

  // for the bottom floor
  stroke(255);
  rectMode(CENTER);
  strokeWeight(1);
  fill(255, 100);
  translate(0, 1);
  rotateX(PI / 2);
  square(0, 0, 2);
}

function mousePressed() {
  console.log(poses);
}
