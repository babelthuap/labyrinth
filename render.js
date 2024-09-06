const Cell = {
  NEITHER: 0,
  RIGHT: 1,
  DOWN: 2,
  BOTH: 3,
};

export function renderBlocky(labyrinth) {
  const grid = toGrid(labyrinth);
  const labyrinthEl = document.getElementById('labyrinth-el');
  labyrinthEl.innerHTML = '';
  labyrinthEl.classList = 'blocky';
  labyrinthEl.style.width = `${grid.width * 16}px`;
  for (const wall of grid.walls) {
    const div = document.createElement('div');
    if (wall) {
      div.classList.add('wall');
    }
    labyrinthEl.append(div);
  }
}

function toGrid({cells, width}) {
  const height = cells.length / width;
  const gridHeight = 1 + 2 * height;
  const gridWidth = 1 + 2 * width;
  const walls = new Array(gridHeight * gridWidth).fill(true);
  for (let y = 0; y < height; y++) {
    const offset = ((y << 1) + 1) * gridWidth;
    for (let x = 0; x < width; x++) {
      const g = offset + (x << 1) + 1;
      walls[g] = false;
      switch (cells[y * width + x]) {
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

const SLIM_CELL_CLASS = {
  [Cell.NEITHER]: 'neither',
  [Cell.RIGHT]: 'right',
  [Cell.DOWN]: 'down',
  [Cell.BOTH]: 'both',
};

export function renderHairline(labyrinth) {
  const labyrinthEl = document.getElementById('labyrinth-el');

  labyrinthEl.innerHTML = '';
  labyrinthEl.classList = 'hairline';
  // Get the actual width of a hairline div
  const testDiv = document.createElement('div');
  labyrinthEl.append(testDiv);
  const divWidth = testDiv.getBoundingClientRect().width;
  testDiv.remove();
  labyrinthEl.style.width = `${labyrinth.width * divWidth}px`;
  // Now simply transform each cell into a div
  for (const cell of labyrinth.cells) {
    const div = document.createElement('div');
    div.classList.add(SLIM_CELL_CLASS[cell]);
    labyrinthEl.append(div);
  }
}