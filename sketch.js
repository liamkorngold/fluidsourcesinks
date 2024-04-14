class Blob {
  constructor(position,velocity) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = createVector(0,0);
    this.mass = 3e-26;
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

  n_sinks_sources = 5;

  sinks_sources = new Array(n_sinks_sources);

  for (i = 0; i < n_sinks_sources; i ++) {
    if(round(random(1)) == 1) {
      sinks_sources[i] = new Sink(createVector(random(window.innerWidth-20),random(window.innerHeight-20)), 5+random(5));
    } else {
      sinks_sources[i] = new Source(createVector(random(window.innerWidth-20), random(window.innerHeight-20)), 5+random(5));
    }
    
    

  }

}

function draw() {
  // could add viscosity?

  for (i = 0; i < n_blobs; i++) {
    for (j = 0; j < n_sinks_sources; j++) {
      stroke(0);
      point(blobs[i].oldPosition);

      stroke(blobs[i].colour[0],blobs[i].colour[1],blobs[i].colour[2]);
    

      speed = sinks_sources[j].rate / (2 * Math.PI * p5.Vector.sub(blobs[i].position, sinks_sources[j].position).mag());

      // points from blob to sink
      r_vector = p5.Vector.sub(sinks_sources[j].position, blobs[i].position);
      
      if (sinks_sources[j].type == "sink") {
        
        
        blobs[i].velocity = r_vector.mult(speed);
        blobs[i].position.add(blobs[i].velocity);
        point(blobs[i].position);

        blobs[i].oldPosition = blobs[i].position;
      } else {
        blobs[i].velocity = r_vector.mult(-speed);
        blobs[i].position.add(blobs[i].velocity);
        point(blobs[i].position);

        blobs[i].oldPosition = blobs[i].position;
      }
      
    }
  }

  for (i = 0; i < n_blobs; i ++) {
    for (j = 0; j < n_sinks_sources; j++) {
      // small tolerance in case blobs aren't perfectly at the sink
      if (round(blobs[i].position.x - sinks_sources[j].position.x) in [-2,-1,0,1,2] & round(blobs[i].position.y-sinks_sources[j].position.y) in [-2,-1,0,1,2]) {
        stroke(0);
        point(blobs[i].position);
        blobs[i] = new Blob(createVector(random(window.innerWidth),random(window.innerHeight-4)),createVector(0,0));
      } else if (blobs[i].position.x > window.innerWidth || blobs[i].position.y > window.innerHeight || blobs[i].position.x < 0 || blobs[i].position.y  < 0) {
        blobs[i] = new Blob(createVector(random(window.innerWidth),random(window.innerHeight-4)),createVector(0,0));
      }
    }
    
    
  } 

  if (mouseIsPressed == true) {
    sinks_sources[0].position.set(mouseX, mouseY);
  }
  


  
  
}