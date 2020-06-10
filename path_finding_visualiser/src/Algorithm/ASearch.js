var visitedNodesInOrder = [];
var nodesInShortestPathOrder = [];
var dest_row, dest_col;
var unvisitedNodes = [];

export function astar(grid, start_node, end_node) {
  // Handle any weird edge cases

  unvisitedNodes = getAllNodes(grid);
  start_node.distance = 0;

  while (unvisitedNodes.length !== 0) {
    sortNodesByDistance(unvisitedNodes);
    // Removes the first node and gives it to us
    const closestNode = unvisitedNodes.shift();
    closestNode.isVisited = true;
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // We must be trapped and should therefore stop.
    if (closestNode.distance === 1000000000) return visitedNodesInOrder;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === end_node) return visitedNodesInOrder;

    updateNeighbors(closestNode, grid);
  }
  return visitedNodesInOrder;
}

function get_euclid_distance(x1, y1, x2, y2) {
  var v1 = Math.pow(x1 - x2, 2);
  v1 = v1 * v1;
  var v2 = Math.pow(y1 - y2, 2);
  v2 = v2 * v2;
  return Math.pow(v1 + v2, 0.5);
}

/* this is our sor function, the place where A* differs from dijkstra's
 Here we sort based on a function f=g+h, where,
 g - distance with which we reach the neighbor node
 h - the heurestic/ prediction/ possible amount of moves to reach target
 this heurestic can be say euclidean distance, or manhattan distance etc
*/

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => {
    return (
      nodeA.distance +
      get_euclid_distance(nodeA.row, nodeA.col, dest_row, dest_col) -
      (nodeB.distance +
        get_euclid_distance(nodeB.row, nodeB.col, dest_row, dest_col))
    );
  });
}

function updateNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const nodes of unvisitedNeighbors) {
    nodes.distance = node.distance + 1;
    nodes.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  //We are only concerned about the unvisited neighbors
  return neighbors.filter((node) => !node.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function solve_astar(grid, start_node, end_node) {
  visitedNodesInOrder = [];
  nodesInShortestPathOrder = [];
  dest_row = end_node.row;
  dest_col = end_node.col;
  return astar(grid, start_node, end_node);
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrderASTAR(finishNode) {
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
