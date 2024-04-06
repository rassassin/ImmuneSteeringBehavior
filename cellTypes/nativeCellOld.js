class Cell {
  constructor(x, y) {
    if (x && y) this.position = createVector(this.x, this.y);
    this.position = createVector(random(this.x), random(this.y));
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.radius = 20; // when a cell consumes nutrients, its radius is increased
    this.colour = color(0, 255, 0, 100);
    this.maxspeed = 5;
    this.maxforce = 0.5;
  }

  update(qt) {
    let found = qt
      .query({
        x: this.x - this.range / 2,
        y: this.y - this.range / 2,
        w: this.range,
        h: this.range,
      })
      .filter((entity) => entity.type == targetMap[this.type])
      .map((entity) => ({
        distance: dist(this.x, this.y, entity.x, entity.y),
        ...entity,
      }));
    found.sort((a, b) => a.distance - b.distance);
    if (found.length > 0) this.moveTo(found[0].x, found[0].y);
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.x < 0) this.x = window.innerWidth + this.x;
    if (this.x > window.innerWidth) this.x -= window.innerWidth;
    if (this.y < 0) this.y = window.innerHeight + this.y;
    if (this.y > window.innerHeight) this.y -= window.innerHeight;

    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  eat(list) {
    let record = Infinity;
    let closest = null;
    for (let i = 0; i < list.length; i++) {
      let d = this.position.dist(list[i]);
      if (d < record) {
        record = d;
        closest = i;
      }
    }
    if (record < 5) list.splice(closest, 1);

    this.seek(list[closest]);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    const desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    this.applyForce(steer);
  }

  mitosis() {
    return new Cell(this.position, this.radius / 2, this.c);
  }

  display() {
    noStroke();
    fill(this.colour);
    ellipse(this.position.x, this.position.y, this.radius, this.radius);
  }
}
/*
  // stops from going off the page
  this.x += this.velocity.x;
  this.y += this.velocity.y;
  if (this.x < 0) this.x = window.innerWidth + this.x;
  if (this.x > window.innerWidth) this.x -= window.innerWidth;
  if (this.y < 0) this.y = window.innerHeight + this.y;
  if (this.y > window.innerHeight) this.y -= window.innerHeight;

  // implement steering
  update() {
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }
  */
