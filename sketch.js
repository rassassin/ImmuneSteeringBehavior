let normalCells = [];
let viruses = [];
let nutrients = [];
const cellCount = 1000;
const virusCount = 1;
const nutrientCount = 50;
let cellQuadTree;
let virusQuadTree;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  virusQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);

  createStillEntities(nutrients, nutrientCount);

  for (let i = 0; i < cellCount; i++) {
    normalCells.push(new Cell());
  }

  for (let i = 0; i < virusCount; i++) {
    viruses.push(new Cell());
  }
}

function draw() {
  cellQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  virusQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  background(220);

  for (const nutrient of nutrients) {
    noStroke();
    fill(color(0, 0, 255, 100));
    ellipse(nutrient.x, nutrient.y, 10, 10);
  }

  for (const cell of normalCells) {
    cellQuadTree.add(cell);
  }

  for (const virus of viruses) {
    virusQuadTree.add(virus);
  }

  for (const cell of normalCells) {
    cell.eatNutrients(nutrients);
    cell.update(cellQuadTree);
  }

  for (const virus of viruses) {
    virus.eatCell(normalCells);
    virus.update(virusQuadTree);
  }

  cellQuadTree.show(0, 255, 0);
  virusQuadTree.show(255, 0, 0);
}

setInterval(() => createStillEntities(nutrients, 1), 1000 * 30);

function createStillEntities(entityList, entityCount) {
  for (let i = 0; i < entityCount; i++) {
    entityList.push(createVector(random(width), random(height)));
  }
}
