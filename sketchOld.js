let cells = [];
let nutrients = [];
let qt;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);

  for (let i = 0; i < 10; i++) {
    cellCount.push(new Cell(random(Number), random(Number)));
  }

  for (let i = 0; i < 10; i++) {
    nutrients.push(createVector(random(width), random(height)));
  }
}

function draw() {
  cellQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  background(51);

  // Draw Nutrients
  for (const nutrient of nutrients) {
    noStroke();
    ellipse(nutrient.x, nutrient.y, 8, 8);
  }

  // Draw cells
  for (const cell of cellCount) {
    cellQuadTree.add(cell);
    cell.eat(nutrients);
    cell.update(cellQuadTree); // implement steering towards nutrients
    cell.display();
  }

  cellQuadTree.show();
}

/* 
if (nutrients >= 100) {
      // if cell nutrient propery reaches 100, mitose
      cells.push(cell.mitosis(cell.position.x, cell.position.y));
      cells.push(cell.mitosis(cell.position.x, cell.position.y));
      cells.splice(cell, 1);
    }
*/
