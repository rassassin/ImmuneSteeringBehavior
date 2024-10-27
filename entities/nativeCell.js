const jiggleForce = 0.3;
const cellVision = 50;
const virusVision = 30;
let lymphocyteVision = 60;
const lymphocyteIncreasedVision = 200;
let showVision = true;
const lymphocyteKillThreshold = 4;
const lymphocyteLife = 3600;

class Cell {
  constructor(position, vision, original = true) {
    this.maxSpeed = 2;
    this.maxForce = 0.3;
    this.diameter = 15;
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(Math.random() * this.maxSpeed, Math.random() * this.maxSpeed);
    this.position = position ?? createVector(random(windowWidth), random(windowHeight));
    this.vision = vision ?? cellVision;
    this.eatCount = 0;
    this.original = original;
    this.life = lymphocyteLife;
  }

  show(red, green, blue) {
    noStroke();
    fill(color(red, green, blue, 100));
    circle(this.position.x, this.position.y, this.diameter);

    if (showVision) {
      noFill();
      strokeWeight(1);
      stroke(red, green, blue);

      circle(this.position.x, this.position.y, this.vision);
    }
  }

  update() {
    if (this.vision === lymphocyteVision && !this.original) {
      this.life--;
    }
    this.jiggle();
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);

    if (this.position.x < 0) this.position.x = window.innerWidth + this.position.x;
    if (this.position.x > window.innerWidth) this.position.x -= window.innerWidth;
    if (this.position.y < 0) this.position.y = window.innerHeight + this.position.y;
    if (this.position.y > window.innerHeight) this.position.y -= window.innerHeight;
  }

  eatNutrients(list, entity) {
    const vision = entity === lymphocytes ? lymphocyteVision : cellVision;
    if (this.vision === lymphocyteIncreasedVision) return;
    let record = Infinity;
    let closest = null;
    for (let i = 0; i < list.length; i++) {
      const d = this.position.dist(list[i].position);
      if (d > vision) continue;
      if (d < record) {
        record = d;
        closest = i;
      }
    }

    if (closest === null) return;

    this.seek(list[closest].position);

    if (record < 5) {
      list.splice(closest, 1);
      if (vision === cellVision) this.mitosis(normalCells);
      if (vision === lymphocyteVision) {
        this.vision = lymphocyteIncreasedVision;
        this.maxSpeed *= 1.5;
        this.maxForce /= 0.6;
        setTimeout(() => {
          this.maxSpeed = 2;
          this.maxForce = 0.3;
          this.vision = lymphocyteVision;
        }, 1000 * 7);
      }
    }
  }

  eatCell(list, entity) {
    const vision = entity === viruses ? virusVision : lymphocyteVision;
    let record = Infinity;
    let closest = null;
    for (let i = 0; i < list.length; i++) {
      const d = this.position.dist(list[i].position);
      if (d > vision) continue;
      if (d < record) {
        record = d;
        closest = i;
      }
    }
    if (closest === null) return;

    this.seek(list[closest].position);

    let chanceChemokineCreation = Math.floor(Math.random() * 11);

    if (record < 5) {
      list.splice(closest, 1);
      if (entity === viruses) {
        this.mitosis(entity, virusVision);
        this.mitosis(entity, virusVision);
        if (chanceChemokineCreation > 8) this.createChemokine();
      }
      if (entity === lymphocytes) {
        this.eatCount++;
        if (this.eatCount > lymphocyteKillThreshold) {
          this.eatCount = 0;
          this.life = lymphocyteLife;
          this.mitosis(entity, lymphocyteVision);
        }
      }
    }
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
    this.acceleration.limit(this.maxForce);
  }

  seek(target) {
    if (!target) return;
    const desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxSpeed);

    // Steering = Desired minus velocity
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce); // Limit to maximum steering force

    this.applyForce(steer);
  }

  jiggle() {
    const num = jiggleForce * 3;
    const randomVector = createVector(random(-num, num), random(-num, num));
    this.applyForce(randomVector);
  }

  mitosis(list, vision) {
    list.push(new Cell(this.position.copy(), vision, false));
  }

  createChemokine() {
    chemokines.push(new Chemokine(this.position.copy()));
  }
}
