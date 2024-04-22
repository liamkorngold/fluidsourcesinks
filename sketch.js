class Blob {
  constructor(position,velocity) {
    this.position = position;
    this.velocity = velocity;
    this.oldPosition = this.position;
    this.colour = [random(255),random(255),random(255)];
  }
}

class Sink {
  constructor(position, rate) {
    this.rate = rate;
    this.position = position;
    this.type = "sink";
  }
}

class Source {
  constructor(position, rate) {
    this.rate = rate;
    this.position = position;
    this.type = "source";
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight-4);

  background(0);

  n_blobs = 800;
  blobs = new Array(n_blobs);

  for (i = 0; i < n_blobs; i ++ ){
    
    blobs[i] = new Blob(createVector(random(window.innerWidth),random(window.innerHeight-4)),createVector(0,0));
  }

  n_sinks_sources = 4;

  sinks_sources = new Array(n_sinks_sources);
  negative = -1;

  for (i = 0; i < n_sinks_sources; i ++) {
    if(round(random(1)) == 1) {
      sinks_sources[i] = new Sink(createVector(random(window.innerWidth-20),random(window.innerHeight-20)), 10+ negative * random(15));
    } else {
      sinks_sources[i] = new Source(createVector(random(window.innerWidth-20), random(window.innerHeight-20)), 10+ negative *random(15));
    }
    
    if (negative == -1) {
      negative = 1;
    } else {
      negative = -1;
    }
    

  }

  trails = true;
}

function keyTyped() {
  // clear trails when c is pressed
  if (key == 'c') {
    clear();
    background(0);
  } else if (key == 't') { // toggle trails
    if (trails == true) {
      trails = false;
    } else {
      trails = true;
      clear();
      background(0);
    }
    
  } 
}

function draw() {

  if (trails == false) {
    clear();
    background(0);
    strokeWeight(15);
    for (j = 0; j < n_sinks_sources; j++) {
      if (sinks_sources[j].type == "sink") {
        stroke(255);
        point(sinks_sources[j].position);
      } else {
        stroke('blue');
        point(sinks_sources[j].position);
      }
      
    }
    strokeWeight(5);
  } else {
    strokeWeight(1);
  }

  for (i = 0; i < n_blobs; i++) {
    blobs[i].acceleration = createVector(0,0);
    for (j = 0; j < n_sinks_sources; j++) {
      stroke(0);
      point(blobs[i].oldPosition);

      stroke(blobs[i].colour[0],blobs[i].colour[1],blobs[i].colour[2]);

      // points from blob to sink
      r_vector = p5.Vector.sub(sinks_sources[j].position, blobs[i].position);
      accel = sinks_sources[j].rate / (2 * Math.PI * r_vector.mag()**2);
      
      // sink/source force
      if (sinks_sources[j].type == "sink") {
        blobs[i].acceleration.add(r_vector.mult(accel));  
      } else {
        blobs[i].acceleration.add(r_vector.mult(-accel));
      }
      
      // drag force = 1/2 *C * A * p * v^2
      // here we take C = 0.47 (sphere), A = 1, p = a smaller number (just a nice value);
      drag = p5.Vector.normalize(blobs[i].velocity); // points in velocity direction
      

      if (sinks_sources[j].type == "sink") {
        drag.mult(-1 * 0.5 * 0.47 * 0.1 * (p5.Vector.mag(blobs[i].velocity) **2 )); // negative as drag opposes velocity
        blobs[i].acceleration.add(drag);  
      } else {
        drag.mult(-1 * 0.5 * 0.47 * 0.1 * (p5.Vector.mag(blobs[i].velocity) **2 )); // negative as drag opposes velocity
        blobs[i].acceleration.add(drag);
      }

      blobs[i].acceleration.add(drag);
    }
    blobs[i].velocity.add(blobs[i].acceleration);
    blobs[i].position.add(blobs[i].velocity);
    point(blobs[i].position);
    blobs[i].oldPosition = blobs[i].position;
  }

  for (i = 0; i < n_blobs; i ++) {
    for (j = 0; j < n_sinks_sources; j++) {
      // small tolerance in case blobs aren't perfectly at the sink
      if (sinks_sources[j].type == "sink") {
        if (Math.abs(round(blobs[i].position.x - sinks_sources[j].position.x)) in [0,1] & Math.abs(round(blobs[i].position.y-sinks_sources[j].position.y)) in [0,1]) {
          stroke(0);
          point(blobs[i].position);
          blobs[i] = new Blob(createVector(random(window.innerWidth),random(window.innerHeight-4)),createVector(0,0));
        } else if (blobs[i].position.x > window.innerWidth +5 || blobs[i].position.y > window.innerHeight || blobs[i].position.x < -5 || blobs[i].position.y  < -5) {
          blobs[i] = new Blob(createVector(random(window.innerWidth),random(window.innerHeight-4)),createVector(0,0));
        }
      } else {
        if (Math.abs(round(blobs[i].position.x - sinks_sources[j].position.x)) in [0,1,2,3,4] & Math.abs(round(blobs[i].position.y-sinks_sources[j].position.y)) in [0,1,2,3,4]) {
          blobs[i].velocity.mult(-1);
        } else if (blobs[i].position.x > window.innerWidth +5 || blobs[i].position.y > window.innerHeight || blobs[i].position.x < -5 || blobs[i].position.y  < -5) {
          blobs[i] = new Blob(createVector(random(window.innerWidth),random(window.innerHeight-4)),createVector(0,0));
        }
      }
    
    }
  } 

  if (mouseIsPressed == true) {
    sinks_sources[0].position.set(mouseX, mouseY);
  }

  
  


  
  
}
