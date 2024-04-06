let entities = [];
// const types = ["rock", "paper", "scissors"];
let nutrients = [];
const cellCount = 10;
const nutrientCount = 50;
let qt;

function setup() {
  createCanvas(windowWidth, windowHeight);
  qt = new QuadTree(0, 0, windowWidth, windowHeight);

  for (let i = 0; i < nutrientCount; i++) {
    nutrients.push(createVector(random(width), random(height)));
  }

  for (let i = 0; i < cellCount; i++) {
    entities.push(new Cell());
  }
}

function draw() {
  qt = new QuadTree(0, 0, windowWidth, windowHeight);
  background(220);

  for (const nutrient of nutrients) {
    fill(color(255, 0, 0, 100));
    ellipse(nutrient.x, nutrient.y, 10, 10);
  }

  for (const entity of entities) {
    qt.add(entity);
  }
  for (const entity of entities) {
    entity.eat(nutrients);
    entity.update(qt);
  }
  qt.show();
}
