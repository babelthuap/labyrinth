const labyrinthEl = document.getElementById('labyrinth-el');

const Cell = {
  NEITHER: 0,
  RIGHT: 1,
  DOWN: 2,
  BOTH: 3,
};

function generateLabyrinth(width, height) {
  const numTiles = width * height;
  const tiles = new Uint8Array(numTiles);
  // Do a randomized DFS through the tiles
  const stack = [rand(numTiles)];
  const visited = new Uint8Array(numTiles);
  const nbrs = new Uint32Array(4);
  while (stack.length > 0) {
    const cur = stack[stack.length - 1];
    visited[cur] = 1;
    const x = cur % width;
    let n = 0;
    if (visited[cur - width] === 0) nbrs[n++] = cur - width;           // up
    if (visited[cur + width] === 0) nbrs[n++] = cur + width;           // down
    if (x > 0 && visited[cur - 1] === 0) nbrs[n++] = cur - 1;          // left
    if (x < width - 1 && visited[cur + 1] === 0) nbrs[n++] = cur + 1;  // right
    if (n === 0) {
      stack.pop();
    } else {
      const nbr = nbrs[rand(n)];
      stack.push(nbr);
      if (Math.abs(cur - nbr) === 1) {
        tiles[nbr < cur ? nbr : cur] += 1;  // left or right
      } else {
        tiles[nbr < cur ? nbr : cur] += 2;  // up or down
      }
    }
  }
  return {tiles, width};
}

function rand(n) {
  return Math.floor(Math.random() * n);
}

function toGrid({tiles, width}) {
  const height = tiles.length / width;
  const gridHeight = 1 + 2 * height;
  const gridWidth = 1 + 2 * width;
  const walls = new Array(gridHeight * gridWidth).fill(true);
  for (let y = 0; y < height; y++) {
    const offset = ((y << 1) + 1) * gridWidth;
    for (let x = 0; x < width; x++) {
      const g = offset + (x << 1) + 1;
      walls[g] = false;
      switch (tiles[y * width + x]) {
        case Cell.RIGHT:
          walls[g + 1] = false;
          break;
        case Cell.DOWN:
          walls[g + gridWidth] = false;
          break;
        case Cell.BOTH:
          walls[g + gridWidth] = false;
          walls[g + 1] = false;
          break;
      }
    }
  }
  return {walls, width: gridWidth};
}

function render(labyrinth) {
  const grid = toGrid(labyrinth);
  labyrinthEl.innerHTML = '';
  labyrinthEl.style.width = `${grid.width * 16}px`;
  for (const wall of grid.walls) {
    const div = document.createElement('div');
    if (wall) {
      div.classList.add('wall');
    }
    labyrinthEl.append(div);
  }
}

function fillScreen() {
  console.time('render');
  const width = (window.innerWidth >> 5) - 1;
  const height = (window.innerHeight >> 5) - 1;
  const labyrinth = generateLabyrinth(width, height);
  render(labyrinth);
  console.timeEnd('render');
}

window.addEventListener('click', fillScreen);
fillScreen();