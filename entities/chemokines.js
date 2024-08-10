const chemokineMaxSpeed = 1.5;

class Chemokine {
  constructor(position, velocity) {
    this.diameter = 10;
    this.velocity =
      velocity ??
      createVector(
        Math.random() * chemokineMaxSpeed,
        Math.random() * chemokineMaxSpeed
      );
    this.acceleration = createVector(0, 0);
    this.position =
      position ?? createVector(random(windowWidth), random(windowHeight));
  }

  show(red, green, blue) {
    noStroke();
    fill(color(red, green, blue, 100));
    circle(this.position.x, this.position.y, this.diameter);
  }

  update() {
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(chemokineMaxSpeed);
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
}
