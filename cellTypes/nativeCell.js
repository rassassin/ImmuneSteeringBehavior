const maxSpeed = 2;
const maxForce = 0.3;
const vision = 40;

class Cell {
  constructor(position) {
    this.range = 100;
    this.diameter = 10;
    this.velocity = {
      x: (Math.random() * maxSpeed) / (Math.random() < 0.5 ? 2 : -2),
      y: (Math.random() * maxSpeed) / (Math.random() < 0.5 ? 2 : -2),
    };
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(
      Math.random() * maxSpeed,
      Math.random() * maxSpeed
    );
    this.position =
      position ?? createVector(random(windowWidth), random(windowHeight));
    console.log(this.position, position);
  }

  show() {
    fill(color(0, 255, 0, 100));
    circle(this.position.x, this.position.y, this.diameter);
  }

  update() {
    this.jiggle();
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(maxSpeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);

    if (this.position.x < 0)
      this.position.x = window.innerWidth + this.position.x;
    if (this.position.x > window.innerWidth)
      this.position.x -= window.innerWidth;
    if (this.position.y < 0)
      this.position.y = window.innerHeight + this.position.y;
    if (this.position.y > window.innerHeight)
      this.position.y -= window.innerHeight;
  }

  eat(list) {
    let record = Infinity;
    let closest = null;
    for (let i = 0; i < list.length; i++) {
      const d = this.position.dist(list[i]);
      if (d > vision) continue;
      if (d < record) {
        record = d;
        closest = i;
      }
    }
    if (record < 5) {
      list.splice(closest, 1);
      this.mitosis();
    }
    this.seek(list[closest]);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
    this.acceleration.limit(maxForce);
  }

  seek(target) {
    if (!target) return;
    const desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(maxSpeed);

    // Steering = Desired minus velocity
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(maxForce); // Limit to maximum steering force

    this.applyForce(steer);
  }

  jiggle() {
    const num = maxForce * 3;
    const randomVector = createVector(random(-num, num), random(-num, num));
    this.applyForce(randomVector);
  }

  mitosis() {
    entities.push(new Cell(this.position.copy()));
  }
}

// moveTo(x, y) {
//   const dx = x - this.x;
//   const dy = y - this.y;
//   const angle = atan2(dy, dx);

//   this.acceleration.x = cos(angle) * 0.8;
//   this.acceleration.y = sin(angle) * 0.8;

//   this.acceleration.limit(this.maxSpeed);
// }
