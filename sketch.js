let normalCellCount = document.getElementById("normalCellCount");
let buttonPos;
let toggleEntityVisionButton;

let normalCells = [];
let viruses = [];
let nutrients = [];
let lymphocytes = [];
let chemokines = [];
const cellCount = 10;
const virusCount = 0;
const nutrientCount = 5;
const lymphocyteCount = 15;
let cellQuadTree;
let virusQuadTree;
let lymphocyteQuadTree;
let nutrientQuadTree;

function setup() {
  createCanvas(windowWidth, windowHeight);

  cellQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  virusQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  lymphocyteQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  nutrientQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  chemokinesQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);

  for (let i = 0; i < nutrientCount; i++) {
    nutrients.push(new Chemokine());
  }

  for (let i = 0; i < cellCount; i++) {
    normalCells.push(new Cell());
  }

  for (let i = 0; i < virusCount; i++) {
    viruses.push(new Cell(null, virusVision));
  }

  for (let i = 0; i < lymphocyteCount; i++) {
    lymphocytes.push(new Cell(null, lymphocyteVision));
  }

  toggleEntityVisionButton = createButton("Toggle Vision");
  toggleEntityVisionButton.position(50, 100);
  toggleEntityVisionButton.mousePressed(toggleVision);
  toggleButtonSize = toggleEntityVisionButton.size();
}

function draw() {
  cellQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  virusQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  lymphocyteQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  nutrientQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);
  chemokinesQuadTree = new QuadTree(0, 0, windowWidth, windowHeight);

  background(220);
  showHud();

  let mousePosition = createVector(mouseX, mouseY);

  if (mouseIsPressed === true) {
    if (mouseX <= 50 || mouseX >= 50 + toggleEntityVisionButton.width || mouseY <= 100 || mouseY >= 100 + toggleEntityVisionButton.height) {
      if (mouseButton === LEFT) viruses.push(new Cell(mousePosition, virusVision));
      if (mouseButton === CENTER) nutrients.push(new Chemokine(mousePosition));
      if (mouseButton === RIGHT) normalCells.push(new Cell(mousePosition));
    }
  }

  for (const cell of normalCells) {
    cellQuadTree.add(cell);
  }

  for (const virus of viruses) {
    virusQuadTree.add(virus);
  }

  for (const lymphocyte of lymphocytes) {
    lymphocyteQuadTree.add(lymphocyte);
  }

  for (const nutrient of nutrients) {
    nutrientQuadTree.add(nutrient);
  }

  for (const chemokine of chemokines) {
    chemokinesQuadTree.add(chemokine);
  }

  for (const cell of normalCells) {
    cell.eatNutrients(nutrients, normalCells);
    cell.update(cellQuadTree);
  }

  for (const lymphocyte of lymphocytes) {
    lymphocyte.eatCell(viruses, lymphocytes);
    lymphocyte.eatNutrients(chemokines, lymphocytes);
    lymphocyte.update(lymphocyteQuadTree);
  }

  for (const virus of viruses) {
    virus.eatCell(normalCells, viruses);
    virus.update(virusQuadTree);
  }

  cellQuadTree.show(0, 255, 0);
  virusQuadTree.show(255, 0, 0);
  lymphocyteQuadTree.show(160, 160, 50);
  nutrientQuadTree.show(0, 0, 255);
  chemokinesQuadTree.show(255, 255, 0);
}

setInterval(() => nutrients.push(new Chemokine()), 1000 * 5);

function showHud() {
  const leftPadding = 50;
  const topPadding = 50;
  const gap = 50;
  const strings = [`Number of Lymphocytes: ${lymphocytes.length}`, `Number of Viruses: ${viruses.length}`, `Number of Cells: ${normalCells.length}`, `Number of Nutrients: ${nutrients.length}`, `Number of Chemokines: ${chemokines.length}`];
  noStroke();
  fill("black");
  let position = leftPadding;
  for (const string of strings) {
    text(string, position, topPadding);
    position += textWidth(string);
    position += gap;
  }
}

function toggleVision() {
  showVision = !showVision;
}
