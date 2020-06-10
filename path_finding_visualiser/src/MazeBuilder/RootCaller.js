import * as constants from "../Constants";
import { solve_recursive_backtracker } from "./RecursiveBacktracker";
import { solve_recursive_division } from "./RecursiveDivision";
import { solve_random } from "./RandomMaze";

function get_paths(state_grid, N, M, maze_type) {
  var grid = JSON.parse(JSON.stringify(state_grid));
  var visitedNodesInOrder = [];

  switch (maze_type) {
    case constants.MAZE_RB: {
      visitedNodesInOrder = solve_recursive_backtracker(grid);
      break;
    }
    case constants.MAZE_RD: {
      visitedNodesInOrder = solve_recursive_division(grid, 0, N - 1, 0, M - 1);
      break;
    }
    case constants.MAZE_RAND: {
      visitedNodesInOrder = solve_random(grid, 0, N - 1, 0, M - 1);
      break;
    }
    default:
      break;
  }
  return visitedNodesInOrder;
}

export function solve_maze(state_grid, N, M, maze_type) {
  return get_paths(state_grid, N, M, maze_type);
}
