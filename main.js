const labyrinthEl = document.getElementById('labyrinth-el');

const Cell = {
  NEITHER: 0,
  RIGHT: 1,
  DOWN: 2,
  BOTH: 3,
};

function generate(width, height) {
  const labyrinth = new Array(height);
  for (let i = 0; i < height; i++) {
    labyrinth[i] = new Array(width).fill(Cell.NEITHER);
  }
  const stack = [{y: rand(height), x: rand(width)}];
  const visited = new Array(width * height);
  while (stack.length > 0) {
    const {y, x} = stack[stack.length - 1];
    visited[y * width + x] = true;
    const unvisitedNeighbors = [];
    if (y > 0 && !visited[(y - 1) * width + x]) {
      unvisitedNeighbors.push({y: y - 1, x});
    }
    if (y < height - 1 && !visited[(y + 1) * width + x]) {
      unvisitedNeighbors.push({y: y + 1, x});
    }
    if (x > 0 && !visited[y * width + x - 1]) {
      unvisitedNeighbors.push({y, x: x - 1});
    }
    if (x < width - 1 && !visited[y * width + x + 1]) {
      unvisitedNeighbors.push({y, x: x + 1});
    }
    if (unvisitedNeighbors.length === 0) {
      stack.pop();
    } else {
      const nbr = unvisitedNeighbors[rand(unvisitedNeighbors.length)];
      stack.push(nbr);
      if (nbr.y === y) {
        if (nbr.x > x) {
          labyrinth[y][x] += 1;  // right
        } else {
          labyrinth[nbr.y][nbr.x] += 1;  // left
        }
      } else {
        if (nbr.y > y) {
          labyrinth[y][x] += 2;  // down
        } else {
          labyrinth[nbr.y][nbr.x] += 2;  // up
        }
      }
    }
  }
  return labyrinth;
}

function rand(n) {
  return Math.floor(Math.random() * n);
}

function toGrid(labyrinth) {
  const height = labyrinth.length;
  const width = labyrinth[0].length;
  const grid = new Array(1 + 2 * height);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(1 + 2 * width).fill(true);
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gy = 2 * y + 1;
      const gx = 2 * x + 1;
      grid[gy][gx] = false;
      switch (labyrinth[y][x]) {
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
  const width = grid[0].length;
  labyrinthEl.innerHTML = '';
  labyrinthEl.style.width = `${width * 16}px`;
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
  render(generate(width, height));
}

window.addEventListener('click', fillScreen);
fillScreen();