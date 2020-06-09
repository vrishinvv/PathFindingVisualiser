var visitedNodesInOrder = [];
const N = 27;
const M = 75;
function randomMaze(grid) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      var ok = Math.random() - 0.2;
      if (ok <= 0) {
        visitedNodesInOrder.push(grid[i][j]);
      }
    }
  }
}
export function solve_rm(grid) {
  visitedNodesInOrder = [];
  randomMaze(grid);
  return visitedNodesInOrder;
}
