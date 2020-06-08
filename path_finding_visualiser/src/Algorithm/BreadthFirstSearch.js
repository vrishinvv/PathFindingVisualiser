var visitedNodesInOrder = [];
var nodesInShortestPathOrder = [];
var dest_row, dest_col;

function bfs(grid, row, col) {
  const n = grid[row][col];
  n.isVisited = true;
  n.previousNode = null;
  n.distance = 0;
  var q = [];
  q.push(n);

  while (q.length > 0) {
    var node = q.shift();
    visitedNodesInOrder.push(node);
    if (node.row === dest_row && node.col === dest_col) return;
    var unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const to of unvisitedNeighbors) {
      if (to.isWall) continue;
      if (to.isVisited === false) {
        q.push(to);
        to.previousNode = node;
        to.isVisited = true;
        to.distance = node.distance + 1;
      }
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  //We are only concerned about the unvisited neighbors
  return neighbors.filter((node) => !node.isVisited);
}

export function solve_bfs(grid, start_node, end_node) {
  visitedNodesInOrder = [];
  nodesInShortestPathOrder = [];
  dest_row = end_node.row;
  dest_col = end_node.col;
  bfs(grid, start_node.row, start_node.col);
  return visitedNodesInOrder;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrderBFS(end_node) {
  let currentNode = end_node;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
}
