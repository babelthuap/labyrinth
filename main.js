const labyrinthEl = document.getElementById('labyrinth-el');

const Cell = {
  NEITHER: 0,
  RIGHT: 1,
  DOWN: 2,
  BOTH: 3,
};

function generate(width, height) {
  const numTiles = width * height;
  const tiles = new Uint8Array(numTiles);
  const stack = [rand(numTiles)];
  const visited = new Uint8Array(numTiles);
  const unvisitedNeighbors = new Uint32Array(4);
  while (stack.length > 0) {
    const cur = stack[stack.length - 1];
    visited[cur] = 1;
    const x = cur % width;
    let numNeighbors = 0;
    if (visited[cur - width] === 0) {
      unvisitedNeighbors[numNeighbors++] = cur - width;  // up
    }
    if (visited[cur + width] === 0) {
      unvisitedNeighbors[numNeighbors++] = cur + width;  // down
    }
    if (x > 0 && visited[cur - 1] === 0) {
      unvisitedNeighbors[numNeighbors++] = cur - 1;  // left
    }
    if (x < width - 1 && visited[cur + 1] === 0) {
      unvisitedNeighbors[numNeighbors++] = cur + 1;  // right
    }
    if (numNeighbors === 0) {
      stack.pop();
    } else {
      const nbr = unvisitedNeighbors[rand(numNeighbors)];
      stack.push(nbr);
      if (Math.abs(cur - nbr) === 1) {
        if (nbr > cur) {
          tiles[cur] += 1;  // right
        } else {
          tiles[nbr] += 1;  // left
        }
      } else {
        if (nbr > cur) {
          tiles[cur] += 2;  // down
        } else {
          tiles[nbr] += 2;  // up
        }
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
  const grid = new Array(1 + 2 * height);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(1 + 2 * width).fill(true);
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gy = 2 * y + 1;
      const gx = 2 * x + 1;
      grid[gy][gx] = false;
      switch (tiles[y * width + x]) {
        case Cell.RIGHT:
          grid[gy][gx + 1] = false;
          break;
        case Cell.DOWN:
          grid[gy + 1][gx] = false;
          break;
        case Cell.BOTH:
          grid[gy + 1][gx] = false;
          grid[gy][gx + 1] = false;
          break;
      }
    }
  }
  return grid;
}

function render(labyrinth) {
  console.time('render');
  const grid = toGrid(labyrinth);
  const gridWidth = grid[0].length;
  labyrinthEl.innerHTML = '';
  labyrinthEl.style.width = `${gridWidth * 16}px`;
  let i = 0;
  for (const row of grid) {
    for (const wall of row) {
      const div = document.createElement('div');
      if (wall) {
        div.classList.add('wall');
      }
      labyrinthEl.append(div);
    }
  }
  console.timeEnd('render');
}

function fillScreen() {
  const width = (window.innerWidth >> 5) - 1;
  const height = (window.innerHeight >> 5) - 1;
  const labyrinth = generate(width, height);
  render(labyrinth);
}

window.addEventListener('click', fillScreen);
fillScreen();