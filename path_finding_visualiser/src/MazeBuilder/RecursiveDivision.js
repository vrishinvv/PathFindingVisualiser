var visitedNodesInOrder = [];
function recursiveDivision(grid, start_row, end_row, start_col, end_col) {
  //var cut = Math.floor(Math.random() * 2);
  var cut = end_row - start_row < end_col - start_col ? 1 : 0;
  let diff_rows = end_row - start_row - 1;
  let diff_cols = end_col - start_col - 1;

  console.log(start_row, end_row, start_col, end_col);
  if (diff_rows <= 1 && diff_cols <= 1) return;
  if (diff_rows <= 1) {
    cut = 1;
  }
  if (diff_cols <= 1) {
    cut = 0;
  }

  // it is a horizontal cut
  if (cut === 0) {
    horizontal(
      grid,
      start_row,
      end_row,
      start_col,
      end_col,
      cut,
      diff_rows,
      diff_cols
    );
  } // it is a vertical cut
  else {
    vertical(
      grid,
      start_row,
      end_row,
      start_col,
      end_col,
      cut,
      diff_rows,
      diff_cols
    );
  }
}

function horizontal(
  grid,
  start_row,
  end_row,
  start_col,
  end_col,
  cut,
  diff_rows,
  diff_cols
) {
  let cnt = 0;
  do {
    var rowId = start_row + Math.floor(Math.random() * diff_rows + 1);
    cnt++;
    if (cnt > 10) return;
  } while (
    !(
      grid[rowId][start_col - 1].isWall === true &&
      grid[rowId][end_col + 1].isWall === true
    )
  );
  const freePos = start_col + Math.floor(Math.random() * diff_cols + 1);
  add_to_ans(grid, start_row, end_row, start_col, end_col, cut, rowId, freePos);
  recursiveDivision(grid, start_row, rowId - 1, start_col, end_col);
  recursiveDivision(grid, rowId + 1, end_row, start_col, end_col);
}
function vertical(
  grid,
  start_row,
  end_row,
  start_col,
  end_col,
  cut,
  diff_rows,
  diff_cols
) {
  let cnt = 0;
  do {
    var colId = start_col + Math.floor(Math.random() * diff_cols + 1);
    cnt++;
    if (cnt > 10) return;
  } while (
    !(
      grid[start_row - 1][colId].isWall === true &&
      grid[end_row + 1][colId].isWall === true
    )
  );
  const freePos = start_row + Math.floor(Math.random() * diff_rows + 1);
  add_to_ans(grid, start_row, end_row, start_col, end_col, cut, colId, freePos);
  recursiveDivision(grid, start_row, end_row, start_col, colId - 1);
  recursiveDivision(grid, start_row, end_row, colId + 1, end_col);
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

export function getNodesInOrder(grid, start_row, end_row, start_col, end_col) {
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
