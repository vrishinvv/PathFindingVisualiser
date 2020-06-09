export function dijkstras(grid, start_node, end_node) {
  // Handle any weird edge cases
  const visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);
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

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => {
    return nodeA.distance - nodeB.distance;
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

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
