// Minor optimization: Reuse this array to collect unvisited neighbors during
// the DFS. This avoids some garbage creation.
const nbrs = new Uint32Array(4);

/**
 * Generates a labyrinth, expressed as a grid of square cells. Each cell is in
 * one of four states, stored as ints:
 *
 * - 0: Has a wall both to the right and down
 * - 1: Has a wall to the right, but is open down
 * - 2: Has a wall down, but is open right
 * - 3: Is open both to the right and down
 *
 * We don't need to store info about the "left" and "up" walls, since that would
 * be redundant. And we are very un-redundant people.
 *
 * The returned array `cells` is a flat (1D) array, but logically represents a
 * grid of the given width and height when laid out from left-to-right,
 * top-to-bottom.
 */
export function generateLabyrinth(width, height) {
  const numTiles = width * height;
  const cells = new Uint8Array(numTiles);
  // Do a randomized DFS through the cells
  const stack = [rand(numTiles)];
  const visited = new Uint8Array(numTiles);
  visited[stack[0]] = 1;
  while (stack.length > 0) {
    // Consider the cell on the top of the stack
    const cur = stack[stack.length - 1];
    const x = cur % width;
    // Collect its unvisited neighbors
    let n = 0;
    if (visited[cur - width] === 0) nbrs[n++] = cur - width;           // up
    if (visited[cur + width] === 0) nbrs[n++] = cur + width;           // down
    if (x > 0 && visited[cur - 1] === 0) nbrs[n++] = cur - 1;          // left
    if (x < width - 1 && visited[cur + 1] === 0) nbrs[n++] = cur + 1;  // right
    if (n === 0) {
      // If there are no unvisited neighbors, pop `cur` off the stack
      stack.pop();
    } else {
      // Otherwise, visit a random unvisited neighbor
      const nbr = nbrs[rand(n)];
      visited[nbr] = 1;
      stack.push(nbr);
      if (Math.abs(cur - nbr) === 1) {
        cells[nbr < cur ? nbr : cur] += 1;  // left or right
      } else {
        cells[nbr < cur ? nbr : cur] += 2;  // up or down
      }
    }
  }
  return {cells, width};
}

/** Returns a random int in [0, n) */
function rand(n) {
  return Math.floor(Math.random() * n);
}