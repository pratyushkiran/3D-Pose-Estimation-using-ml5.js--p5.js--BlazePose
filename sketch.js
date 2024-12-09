let video;

let bodyPose;

let lerpedX = 0;
let lerpedY = 0;

let lerpAmount = 0.4;

poses = [];

let videoWidth, videoHeight, videoOffsetX, videoOffsetY;

function preload() {
  bodyPose = ml5.bodyPose("BlazePose", { flipped: true }); // for more keypoints and 3d poses
}

function gotPoses(results) {
  poses = results;
}

function mousePressed() {
  console.log(poses);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  video = createCapture(VIDEO, {flipped: true});
  video.size(640, 480); // Default video dimensions (you can adjust if needed)
  // video.hide();
  bodyPose.detectStart(video, gotPoses); 
  connections = bodyPose.getSkeleton();
  console.log(connections);
}

function draw() {
  // scale(5);  
  background(0);
  maintainAspectRatio();

  // image(video, videoOffsetX, videoOffsetY, videoWidth, videoHeight);

  if (poses.length > 0) {
    let pose = poses[0];

    // draw keypoints
    for (let i = 0; i < pose.keypoints3D.length; i++) {
      let keypoint = pose.keypoints3D[i];
      if (keypoint.confidence > 0.3) {
        // Scale keypoints to match the video on canvas
        let x = map(keypoint.x, 0, video.width, videoOffsetX, videoOffsetX + videoWidth);
        let y = map(keypoint.y, 0, video.height, videoOffsetY, videoOffsetY + videoHeight);
        let z = keypoint.z;

        fill(0, 255, 0);
        strokeWeight(4);
        point(x, y, z);
      }
    }

    // Draw connections between keypoints
    for (let i = 0; i < connections.length; i++) {
      let connection = connections[i];
      let a = connection[0];
      let b = connection[1];

      let keyPointA = pose.keypoints3D[a];
      let keyPointB = pose.keypoints3D[b];

      if (keyPointA.confidence > 0.3 && keyPointB.confidence > 0.3) {
        let x1 = map(keyPointA.x, 0, video.width, videoOffsetX, videoOffsetX + videoWidth);
        let y1 = map(keyPointA.y, 0, video.height, videoOffsetY, videoOffsetY + videoHeight);
        let x2 = map(keyPointB.x, 0, video.width, videoOffsetX, videoOffsetX + videoWidth);
        let y2 = map(keyPointB.y, 0, video.height, videoOffsetY, videoOffsetY + videoHeight);
        let z1 = keyPointA.z;
        let z2 = keyPointB.z;

        stroke(0, 255, 0);
        strokeWeight(4);
        beginShape();
        vertex(x1, y1, z1);
        vertex(x2, y2, z2);
        endShape();
      }
    }
  }
}

function maintainAspectRatio() {
  let videoAspectRatio = video.width / video.height;
  let canvasAspectRatio = width / height;

  if (canvasAspectRatio > videoAspectRatio) {
    // Canvas is wider than video
    videoHeight = height;
    videoWidth = videoHeight * videoAspectRatio;
    videoOffsetX = (width - videoWidth) / 2;
    videoOffsetY = 0;
  } else {
    // Canvas is taller than video
    videoWidth = width;
    videoHeight = videoWidth / videoAspectRatio;
    videoOffsetX = 0;
    videoOffsetY = (height - videoHeight) / 2;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
