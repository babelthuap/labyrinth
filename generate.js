export function generateLabyrinth(width, height) {
  const numTiles = width * height;
  const cells = new Uint8Array(numTiles);
  // Do a randomized DFS through the cells
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
        cells[nbr < cur ? nbr : cur] += 1;  // left or right
      } else {
        cells[nbr < cur ? nbr : cur] += 2;  // up or down
      }
    }
  }
  return {cells, width};
}

function rand(n) {
  return Math.floor(Math.random() * n);
}