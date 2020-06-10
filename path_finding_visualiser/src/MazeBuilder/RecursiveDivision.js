var visitedNodesInOrder = [];
function recursiveDivision(grid, start_row, end_row, start_col, end_col) {
  //var cut = Math.floor(Math.random() * 2);
  var cut = end_row - start_row <= end_col - start_col ? 1 : 0;

  if (end_row - start_row < 2 && end_col - start_col < 2) return;

  // it is a horizontal cut
  if (cut === 0) {
    horizontal(grid, start_row, end_row, start_col, end_col, cut);
  } // it is a vertical cut
  else {
    vertical(grid, start_row, end_row, start_col, end_col, cut);
  }
}

function horizontal(grid, start_row, end_row, start_col, end_col, cut) {
  var seeMe = [];
  for (let i = start_row + 1; i <= end_row - 1; i += 2) {
    seeMe.push(i);
  }
  shuffle(seeMe);
  if (seeMe.length === 0) return;
  var rowId = seeMe[0];
  seeMe = [];
  for (let i = start_col; i <= end_col; i += 2) {
    seeMe.push(i);
  }
  shuffle(seeMe);
  if (seeMe.length === 0) return;
  var freePos = seeMe[0];
  add_to_ans(grid, start_row, end_row, start_col, end_col, cut, rowId, freePos);
  recursiveDivision(grid, start_row, rowId - 1, start_col, end_col);
  recursiveDivision(grid, rowId + 1, end_row, start_col, end_col);
}

function vertical(grid, start_row, end_row, start_col, end_col, cut) {
  var seeMe = [];
  for (let i = start_col + 1; i <= end_col - 1; i += 2) {
    seeMe.push(i);
  }
  shuffle(seeMe);
  if (seeMe.length === 0) return;
  var colId = seeMe[0];
  seeMe = [];
  for (let i = start_row; i <= end_row; i += 2) {
    seeMe.push(i);
  }
  shuffle(seeMe);
  if (seeMe.length === 0) return;
  var freePos = seeMe[0];
  add_to_ans(grid, start_row, end_row, start_col, end_col, cut, colId, freePos);
  recursiveDivision(grid, start_row, end_row, start_col, colId - 1);
  recursiveDivision(grid, start_row, end_row, colId + 1, end_col);
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function add_to_ans(
  grid,
  start_row,
  end_row,
  start_col,
  end_col,
  cut,
  id,
  skip
) {
  if (cut === 0) {
    for (let i = start_col; i <= end_col; i++) {
      if (skip === i) continue;
      grid[id][i].isWall = true;
      visitedNodesInOrder.push(grid[id][i]);
    }
  } else {
    for (let i = start_row; i <= end_row; i++) {
      if (skip === i) continue;
      grid[i][id].isWall = true;
      visitedNodesInOrder.push(grid[i][id]);
    }
  }
}

export function solve_recursive_division(
  grid,
  start_row,
  end_row,
  start_col,
  end_col
) {
  visitedNodesInOrder = [];
  for (let i = start_col; i <= end_col; i++) {
    grid[start_row][i].isWall = grid[end_row][i].isWall = true;
    visitedNodesInOrder.push(grid[start_row][i]);
    visitedNodesInOrder.push(grid[end_row][i]);
  }
  for (let i = start_row; i <= end_row; i++) {
    grid[i][start_col].isWall = grid[i][end_col].isWall = true;
    visitedNodesInOrder.push(grid[i][start_col]);
    visitedNodesInOrder.push(grid[i][end_col]);
  }

  recursiveDivision(
    grid,
    start_row + 1,
    end_row - 1,
    start_col + 1,
    end_col - 1
  );
  return visitedNodesInOrder;
}

/*
Make the dimensions odd,
choose even places to draw walls, 
choose odd places to make openings
apply recursive division to solve the problem
*/
