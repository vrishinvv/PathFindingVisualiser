var visitedNodesInOrder = [];
const N = 27;
const M = 75;
// it is a simple function to randomly place walls in a grid
// where every node has a 25% chance of being a wall
function randomMaze(grid) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      var ok = Math.random() - 0.25;
      if (ok <= 0) {
        visitedNodesInOrder.push(grid[i][j]);
      }
    }
  }
}

export function solve_random(grid) {
  visitedNodesInOrder = [];
  randomMaze(grid);
  return visitedNodesInOrder;
}
