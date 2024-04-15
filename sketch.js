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

  n_blobs = 1000;
  blobs = new Array(n_blobs);

  for (i = 0; i < n_blobs; i ++ ){
    
    blobs[i] = new Blob(createVector(random(window.innerWidth),random(window.innerHeight-4)),createVector(0,0));
  }

  n_sinks_sources = 3;

  sinks_sources = new Array(n_sinks_sources);

  for (i = 0; i < n_sinks_sources; i ++) {
    if(round(random(1)) == 1) {
      sinks_sources[i] = new Sink(createVector(random(window.innerWidth-20),random(window.innerHeight-20)), 2+random(3));
    } else {
      sinks_sources[i] = new Source(createVector(random(window.innerWidth-20), random(window.innerHeight-20)), 2+random(3));
    }
    console.log(sinks_sources[i].rate);
    
    

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
    blobs[i].velocity = createVector(0,0);
    for (j = 0; j < n_sinks_sources; j++) {
      stroke(0);
      point(blobs[i].oldPosition);

      stroke(blobs[i].colour[0],blobs[i].colour[1],blobs[i].colour[2]);

      // points from blob to sink
      r_vector = p5.Vector.sub(sinks_sources[j].position, blobs[i].position);
      speed = sinks_sources[j].rate / (2 * Math.PI * r_vector.mag());
      
      if (sinks_sources[j].type == "sink") {
        blobs[i].velocity.add(r_vector.mult(speed));  
      } else {
        blobs[i].velocity.add(r_vector.mult(-speed));
      }
      
    }
    blobs[i].position.add(blobs[i].velocity);
    point(blobs[i].position);
    blobs[i].oldPosition = blobs[i].position;
  }

  for (i = 0; i < n_blobs; i ++) {
    for (j = 0; j < n_sinks_sources; j++) {
      // small tolerance in case blobs aren't perfectly at the sink
      if (Math.abs(round(blobs[i].position.x - sinks_sources[j].position.x)) in [0,1,2,3,4,5] & Math.abs(round(blobs[i].position.y-sinks_sources[j].position.y)) in [0,1,2,3,4,5]) {
        stroke(0);
        point(blobs[i].position);
        blobs[i] = new Blob(createVector(random(window.innerWidth),random(window.innerHeight-4)),createVector(0,0));
      } else if (blobs[i].position.x > window.innerWidth +5 || blobs[i].position.y > window.innerHeight || blobs[i].position.x < -5 || blobs[i].position.y  < -5) {
        blobs[i] = new Blob(createVector(random(window.innerWidth),random(window.innerHeight-4)),createVector(0,0));
      }
    }
    
    
  } 

  if (mouseIsPressed == true) {
    sinks_sources[0].position.set(mouseX, mouseY);
  }

  
  


  
  
}
