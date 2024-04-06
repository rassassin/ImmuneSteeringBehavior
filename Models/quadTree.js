const maxPerCell = 10;

class QuadTree {
  constructor(x, y, width, height, depth = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.maxDepth = 10;
    this.depth = depth;

    this.childParams = {
      TL: { x, y },
      TR: { x: x + width / 2, y },
      BL: { x, y: y + height / 2 },
      BR: { x: x + width / 2, y: y + height / 2 },
    };

    this.nodes = {
      TL: [],
      TR: [],
      BL: [],
      BR: [],
    };
  }

  // use entity position vectors (entity.position.x) and create nutrient class
  add(entity) {
    let nodeKey = entity.position.y < this.y + this.height / 2 ? "T" : "B";
    nodeKey += entity.position.x < this.x + this.width / 2 ? "L" : "R";
    const node = this.nodes[nodeKey];
    if (Array.isArray(node)) {
      if (node.length >= maxPerCell && this.depth < this.maxDepth) {
        const params = this.childParams[nodeKey];
        const qt = new QuadTree(
          params.x,
          params.y,
          this.width / 2,
          this.height / 2,
          this.depth + 1
        );
        for (const e of node) {
          qt.add(e);
        }
        qt.add(entity);
        this.nodes[nodeKey] = qt;
        return;
      }
      node.push(entity);
      return;
    }
    node.add(entity);
  }

  query(range) {
    let points = [];
    for (const key in this.nodes) {
      const node = this.nodes[key];
      if (this.isIntersecting(range, node)) {
        if (Array.isArray(node)) {
          points = [
            ...points,
            ...node.filter(
              (point) =>
                point.x >= range.x &&
                point.x <= range.x + range.w &&
                point.y >= range.y &&
                point.y <= range.y + range.h
            ),
          ];
          continue;
        }
        points = [
          ...points,
          ...node
            .query(range)
            .filter(
              (point) =>
                point.x >= range.x &&
                point.x <= range.x + range.w &&
                point.y >= range.y &&
                point.y <= range.y + range.h
            ),
        ];
      }
    }
    return points;
  }

  isIntersecting(a, b) {
    return (
      a.x + a.w > b.x && a.x < b.x + b.w && a.y + a.h > b.y && a.y < b.y + b.h
    );
  }

  show() {
    for (const key in this.nodes) {
      const node = this.nodes[key];
      if (Array.isArray(node)) {
        for (const entity of node) {
          entity.show();
        }
        continue;
      }
      node.show();
    }
  }
}
