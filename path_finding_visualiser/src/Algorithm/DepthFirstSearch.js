var visitedNodesInOrder = [];
var nodesInShortestPathOrder = [];
var dest_row, dest_col;
var ok = 0;
var type = 1;
function dfs(grid, row, col, par, d) {
  const node = grid[row][col];
  if (node.isWall) return;
  visitedNodesInOrder.push(node);
  node.isVisited = true;
  node.previousNode = par;
  node.distance = d;
  if (row === dest_row && col === dest_col) {
    nodesInShortestPathOrder.push(node);
    ok = 1;
    console.log("yes this happenned");
    return;
  }

  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  if (type === 0) shuffle(unvisitedNeighbors);
  for (const to of unvisitedNeighbors) {
    if (to.isVisited === false) {
      dfs(grid, to.row, to.col, node, d + 1);
      if (ok) {
        nodesInShortestPathOrder.push(node);
        node.previousNode = par;
        break;
      }
    }
  }
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
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

export function solve_dfs(grid, start_node, end_node, t) {
  visitedNodesInOrder = [];
  nodesInShortestPathOrder = [];
  ok = 0;
  dest_row = end_node.row;
  dest_col = end_node.col;
  type = t;
  dfs(grid, start_node.row, start_node.col, null, 0);
  return visitedNodesInOrder;
}

export function getNodesInShortestPathOrderDFS() {
  nodesInShortestPathOrder.reverse();
  return nodesInShortestPathOrder;
}
