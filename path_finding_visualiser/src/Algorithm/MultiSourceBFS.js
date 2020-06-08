var visitedNodesInOrder = [];
var nodesInShortestPathOrder = [];
var end_from_start, end_from_last;

function mbfs(grid, st, en) {
  st.isVisited = en.isVisited = true;
  st.previousNode = en.previousNode = null;
  st.distance = en.distance = 0;
  st.src = 1;
  en.src = 2;
  var q = [];
  q.push(st);
  q.push(en);

  while (q.length > 0) {
    var node = q.shift();
    visitedNodesInOrder.push(node);
    var unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const to of unvisitedNeighbors) {
      if (to.isWall) continue;
      if (to.src !== node.src && to.src !== 0) {
        if (node.src === 0) {
          end_from_start = node;
          end_from_last = to;
        } else {
          end_from_start = to;
          end_from_last = node;
        }
        return;
      }
      if (to.isVisited === false) {
        q.push(to);
        to.previousNode = node;
        to.isVisited = true;
        to.distance = node.distance + 1;
        to.src = node.src;
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
  return neighbors;
}

export function solve_mbfs(grid, start_node, end_node) {
  end_from_last = end_from_start = null;
  visitedNodesInOrder = [];
  nodesInShortestPathOrder = [];
  mbfs(grid, start_node, end_node);
  let currentNode = end_from_last;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  currentNode = end_from_start;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return visitedNodesInOrder;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrderMBFS() {
  return nodesInShortestPathOrder;
}
