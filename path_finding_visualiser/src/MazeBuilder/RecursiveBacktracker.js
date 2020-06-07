var visitedNodesInOrder = [];
function recursiveBacktracker(grid, row, col) {
  const node = grid[row][col];
  visitedNodesInOrder.push(node);
  node.isVisited = true;
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  shuffle(unvisitedNeighbors);
  for (const to of unvisitedNeighbors) {
    if (to.isVisited === false) {
      visitedNodesInOrder.push(
        grid[(node.row + to.row) / 2][(node.col + to.col) / 2]
      );
      recursiveBacktracker(grid, to.row, to.col);
    }
  }
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 1) neighbors.push(grid[row - 2][col]);
  if (row < grid.length - 2) neighbors.push(grid[row + 2][col]);
  if (col > 1) neighbors.push(grid[row][col - 2]);
  if (col < grid[0].length - 2) neighbors.push(grid[row][col + 2]);

  //We are only concerned about the unvisited neighbors
  return neighbors.filter((node) => !node.isVisited);
}

export function solve(grid) {
  visitedNodesInOrder = [];
  recursiveBacktracker(grid, 1, 1);
  return visitedNodesInOrder;
}
