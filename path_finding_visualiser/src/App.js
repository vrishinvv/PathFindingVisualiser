import React from "react";
import "./App.css";
import * as constants from "./Constants";
import NavBar from "./Components/NavBar/NavBar";
import Node from "./Components/Node/Node";
import { solve_algorithm } from "./Algorithm/RootCaller";
import { solve_maze } from "./MazeBuilder/RootCaller";
import "bootstrap/dist/css/bootstrap.min.css";

let START_NODE_ROW = 12;
let START_NODE_COL = 30;
let END_NODE_ROW = 12;
let END_NODE_COL = 40;
let MID_NODE_ROW = -1;
let MID_NODE_COL = -1;
const N = 27;
const M = 75;
let cur_row = -1;
let cur_col = -1;
let algo = "";
var Preserved = [];
var buttonPressed = constants.NONE;
var workIsDone = false;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  do_mouse_work = (state_grid, row, col) => {
    console.log(buttonPressed);
    switch (buttonPressed) {
      case constants.ADD_WALL: {
        add_wall_to_grid(state_grid, row, col);
        break;
      }
      case constants.DEL_WALL: {
        del_wall_from_grid(state_grid, row, col);
        break;
      }

      case constants.START: {
        console.log("ehere as well");
        change_start_node(state_grid, row, col);
        break;
      }
      case constants.END: {
        change_end_node(state_grid, row, col);
        break;
      }
      case constants.MID: {
        change_mid_node(state_grid, row, col);
        break;
      }
      default:
        break;
    }

    if (workIsDone === true) {
      console.log("me");
      //if (this.state.grid[row][col].isWall) return;
      this.visualizeAlgorithm(1, row, col, algo);
    }
  };

  handleMouseDown = (row, col) => {
    //if (row === cur_row && col === cur_col) return;

    this.setState({ mouseIsPressed: true });

    if (this.state.grid[row][col].isStart) {
      buttonPressed = constants.START;
    } else if (this.state.grid[row][col].isEnd) {
      buttonPressed = constants.END;
    } else if (this.state.grid[row][col].isMid) {
      buttonPressed = constants.MID;
    } else if (this.state.grid[row][col].isWall) {
      buttonPressed = constants.DEL_WALL;
    } else {
      buttonPressed = constants.ADD_WALL;
    }
    console.log(buttonPressed);
    this.do_mouse_work(this.state.grid, row, col);

    cur_row = row;
    cur_col = col;
  };

  handleMouseEnter = (row, col) => {
    //if (row === cur_row && col === cur_col) return;
    if (!this.state.mouseIsPressed) return;

    this.do_mouse_work(this.state.grid, row, col);

    cur_row = row;
    cur_col = col;
  };

  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };

  handleChoice = (ch) => {
    if (buttonPressed === ch) buttonPressed = constants.NONE;
    else buttonPressed = ch;
    if (buttonPressed === constants.ADD_MID) add_mid_node(this.state.grid);
    else if (buttonPressed === constants.DEL_MID) del_mid_node(this.state.grid);
  };

  handlePreserveChange = (preserved_data) => {
    Preserved = preserved_data;
  };

  handleAlgorithm = (end_row, end_col, algo_type) => {
    return solve_algorithm(
      this.state.grid,
      START_NODE_ROW,
      START_NODE_COL,
      END_NODE_ROW,
      END_NODE_COL,
      MID_NODE_ROW,
      MID_NODE_COL,
      algo_type
    );
  };

  visualizeAlgorithm = (type, row, col, algo_type) => {
    workIsDone = true;
    algo = algo_type;
    if (type === 1) clear_all(this.state.grid);
    else clear_clever(this.state.grid);
    const ret = this.handleAlgorithm(row, col, algo);
    const visitedNodesInOrder = ret[0];
    const nodesInShortestPathOrder = ret[1];
    animateAlgorithm(
      this.state.grid,
      visitedNodesInOrder,
      nodesInShortestPathOrder,
      type
    );
    //if (buttonPressed !== constants.DONE) buttonPressed = constants.DONE;
  };

  handleMaze = (maze_type) => {
    return solve_maze(this.state.grid, N, M, maze_type);
  };

  visualizeMaze = (maze_type) => {
    this.clearBoard();
    const visitedNodesInOrder = this.handleMaze(maze_type);
    animateMaze(this.state.grid, visitedNodesInOrder, maze_type);
  };

  clearBoard = () => {
    const g = this.state.grid;

    START_NODE_ROW = 12;
    START_NODE_COL = 30;
    END_NODE_ROW = 12;
    END_NODE_COL = 40;
    MID_NODE_ROW = MID_NODE_COL = cur_row = cur_col = -1;

    buttonPressed = constants.NONE;
    workIsDone = false;
    this.setState({ mouseIsPressed: false });
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        var node = g[i][j];

        if (Preserved.includes(constants.PRESERVE_WALLS)) {
          if (node.isWall === true) continue;
        }
        document.getElementById(`node-${i}-${j}`).className = "node";
        node.row = i;
        node.col = j;
        node.isStart =
          node.row === START_NODE_ROW && node.col === START_NODE_COL;
        node.isEnd = node.row === END_NODE_ROW && node.col === END_NODE_COL;
        node.isMid = false;
        node.isWall = false;
        node.isVisited = false;
        node.isVisited2 = false;
        node.isShortest = false;
        node.distance = 1000000000;
        node.previousNode = null;
        node.src = 0;
      }
      document.getElementById(
        `node-${START_NODE_ROW}-${START_NODE_COL}`
      ).className = "node node_start";
      document.getElementById(
        `node-${END_NODE_ROW}-${END_NODE_COL}`
      ).className = "node node_end";
    }
    this.setState({ grid: g });
  };

  componentDidMount() {
    const g = initialiseGrid();
    this.setState({ grid: g });
  }

  render() {
    const { grid, mouseIsPressed, buttonPressed } = this.state;
    return (
      <div>
        <NavBar
          clearBoard={this.clearBoard}
          handleChoice={this.handleChoice}
          visualizeAlgorithm={this.visualizeAlgorithm}
          visualizeMaze={this.visualizeMaze}
          end_node_row={END_NODE_ROW}
          end_node_col={END_NODE_COL}
        />

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {
                    row,
                    col,
                    isEnd,
                    isStart,
                    isWall,
                    isVisited,
                    isVisited2,
                    isMid,
                    isShortest,
                  } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      onMouseClick={(row, col) =>
                        this.handleMouseClick(row, col)
                      }
                      row={row}
                      col={col}
                      isWall={isWall}
                      isStart={isStart}
                      isEnd={isEnd}
                      isMid={isMid}
                      isVisited={isVisited}
                      isVisited2={isVisited2}
                      isShortest={isShortest}
                      mouseIsPressed={mouseIsPressed}
                      buttonPressed={buttonPressed}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const initialiseGrid = () => {
  let grid = [];
  for (let i = 0; i < N; i++) {
    let curRow = [];
    for (let j = 0; j < M; j++) {
      curRow.push(createNode(i, j));
    }
    grid.push(curRow);
  }
  return grid;
};

//return a singular node
const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isEnd: row === END_NODE_ROW && col === END_NODE_COL,
    isMid: false,
    distance: 1000000000, //unable to use Infinity here, cos deep copy does not work with infinity
    isVisited: false,
    isVisited2: false,
    isWall: false,
    isShortest: false,
    previousNode: null,
    src: 0,
  };
};

const add_wall_to_grid = (grid, row, col) => {
  const node = grid[row][col];
  if (node.isWall || node.isMid || node.isEnd || node.isStart) return;
  document.getElementById(`node-${node.row}-${node.col}`).className =
    "node node_wall_add";
  node.isWall = true;
};

const del_wall_from_grid = (grid, row, col) => {
  const node = grid[row][col];
  if (!node.isWall || node.isMid || node.isEnd || node.isStart) return;
  node.isWall = false;
  document.getElementById(`node-${node.row}-${node.col}`).className =
    "node node_wall_del";
};

const change_start_node = (grid, row, col) => {
  const node = grid[row][col];
  if (node.isWall || node.isMid || node.isEnd) return;
  const pnode = grid[START_NODE_ROW][START_NODE_COL];
  pnode.isStart = false;
  document.getElementById(
    `node-${START_NODE_ROW}-${START_NODE_COL}`
  ).className = "node";
  if (workIsDone === false) {
    document.getElementById(`node-${row}-${col}`).className = "node node_start";
  } else {
    document.getElementById(`node-${row}-${col}`).className =
      "node node_start node-shortest-path-2";
  }
  node.isStart = true;
  START_NODE_ROW = row;
  START_NODE_COL = col;
};

const change_end_node = (grid, row, col) => {
  const node = grid[row][col];
  if (node.isWall || node.isMid || node.isStart) return;
  const pnode = grid[END_NODE_ROW][END_NODE_COL];
  pnode.isEnd = false;
  document.getElementById(`node-${END_NODE_ROW}-${END_NODE_COL}`).className =
    "node";
  node.isEnd = true;
  document.getElementById(`node-${row}-${col}`).className = "node node_end";
  END_NODE_ROW = row;
  END_NODE_COL = col;
};

const change_mid_node = (grid, row, col) => {
  const node = grid[row][col];
  if (node.isWall || node.isStart || node.isEnd) return;
  const pnode = grid[MID_NODE_ROW][MID_NODE_COL];
  pnode.isMid = false;
  document.getElementById(`node-${MID_NODE_ROW}-${MID_NODE_COL}`).className =
    "node";
  node.isMid = true;
  document.getElementById(`node-${row}-${col}`).className = "node node_mid";
  MID_NODE_ROW = row;
  MID_NODE_COL = col;
};

const add_mid_node = (grid) => {
  MID_NODE_ROW = 10;
  MID_NODE_COL = 30;
  console.log("here");
  const node = grid[MID_NODE_ROW][MID_NODE_COL];
  node.isMid = true;
  node.isWall = false;
  document.getElementById(`node-${MID_NODE_ROW}-${MID_NODE_COL}`).className =
    "node node_mid";
};

const del_mid_node = (grid) => {
  const node = grid[MID_NODE_ROW][MID_NODE_COL];
  node.isMid = false;
  document.getElementById(`node-${MID_NODE_ROW}-${MID_NODE_COL}`).className =
    "node";
  MID_NODE_ROW = MID_NODE_COL = -1;
};

const clear_all = (grid) => {
  cur_row = cur_col = -1;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (grid[i][j].isWall) continue;
      if (grid[i][j].isVisited) {
        grid[i][j].isVisited = false;
      }
      if (grid[i][j].isVisited2) {
        grid[i][j].isVisited2 = false;
      }
      if (grid[i][j].isShortest) {
        grid[i][j].isShortest = false;
      }
      document.getElementById(`node-${i}-${j}`).className = "node";
    }
  }
};

const clear_clever = (g) => {
  cur_row = cur_col = -1;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      var node = g[i][j];
      if (node.isWall === true) continue;
      document.getElementById(`node-${i}-${j}`).className = "node";
      node.row = i;
      node.col = j;
      node.isStart = node.row === START_NODE_ROW && node.col === START_NODE_COL;
      node.isEnd = node.row === END_NODE_ROW && node.col === END_NODE_COL;
      node.isMid = node.row === MID_NODE_ROW && node.col === MID_NODE_COL;
      node.isWall = false;
      node.isVisited = false;
      node.isVisited2 = false;
      node.isShortest = false;
      node.distance = 1000000000;
      node.previousNode = null;
      node.src = 0;
    }
    document.getElementById(
      `node-${START_NODE_ROW}-${START_NODE_COL}`
    ).className = "node node_start";
    document.getElementById(`node-${END_NODE_ROW}-${END_NODE_COL}`).className =
      "node node_end";
    if (MID_NODE_ROW !== -1) {
      document.getElementById(
        `node-${MID_NODE_ROW}-${MID_NODE_COL}`
      ).className = "node node_mid";
    }
  }
};

const animateShortestPath = (state_grid, nodesInShortestPathOrder, type) => {
  //this variable is used to check in which index mid node occurs, so that we can change colors
  let m = 100000000;
  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    const node = nodesInShortestPathOrder[i];
    if (i === 1) continue;
    if (
      MID_NODE_ROW !== -1 &&
      node.row === MID_NODE_ROW &&
      node.col === MID_NODE_COL
    ) {
      m = i;
      break;
    }
  }

  //animator code begins here
  if (type === 0) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const orig_node = state_grid[node.row][node.col];
        orig_node.isShortest = orig_node.isVisited = true;

        let value = "";
        if (i >= m) {
          value = "node-shortest-path-2";
        } else {
          value = "node-shortest-path";
        }
        if (node.isStart) {
          value += " node_start";
        } else if (node.isMid) {
          value += " node_mid";
        } else if (node.isEnd) {
          value += " node_end";
        }
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = `node ${value}`;
      }, 20 * i);
    }
  } else {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const node = nodesInShortestPathOrder[i];
      const orig_node = state_grid[node.row][node.col];
      orig_node.isShortest = orig_node.isVisited = true;
      if (node.isStart) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node_start node-shortest-path_f";
      } else if (node.isMid) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node_mid node-shortest-path_f";
      } else if (node.isEnd) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node_end node-shortest-path_f";
      } else {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path_f";
      }
    }
  }
};

const animateAlgorithm = (
  state_grid,
  visitedNodesInOrder,
  nodesInShortestPathOrder,
  type
) => {
  //this variable is used to check in which index mid node occurs, so that we can change colors
  let m = 10000000;
  for (let i = 0; i < visitedNodesInOrder.length; i++) {
    const node = visitedNodesInOrder[i];
    if (i === 1) continue;
    if (
      MID_NODE_ROW !== -1 &&
      node.row === MID_NODE_ROW &&
      node.col === MID_NODE_COL
    ) {
      m = i;
      break;
    }
  }

  //animator code begins here
  if (type === 0) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      // use to color the final path, yellow in the end
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(state_grid, nodesInShortestPathOrder, type);
        }, 10 * i);
        return;
      }

      //yellow blinker to indicate current position
      const node = visitedNodesInOrder[i];
      setTimeout(() => {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node_current";
      }, 10 * i - 15);
      setTimeout(() => {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node";
      }, 10 * i - 5);

      //condition to check if I have to change color
      let value = "";
      if (i >= m) {
        value = "node_vis_2";
      } else {
        value = "node_vis";
      }

      if (node.isStart) {
        value += " node_start";
      } else if (node.isMid) {
        value += " node_mid";
      } else if (node.isEnd) {
        value += " node_end";
      }

      //used to color the visited grids in order
      setTimeout(() => {
        const orig_node = state_grid[node.row][node.col];
        orig_node.isVisited = true;
        if (node.isStart === true) orig_node.isStart = true;
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = `node ${value}`;
      }, 10 * i);
    }
  } else {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        animateShortestPath(state_grid, nodesInShortestPathOrder, type);
        return;
      }

      const node = visitedNodesInOrder[i];
      const orig_node = state_grid[node.row][node.col];
      let value = "";
      if (i >= m) {
        value = "node_vis_f_2";
        orig_node.isVisited2 = true;
      } else {
        value = "node_vis_f";
        orig_node.isVisited = true;
      }

      if (node.isStart) {
        value += " node_start";
      } else if (node.isMid) {
        value += " node_mid";
      } else if (node.isEnd) {
        value += " node_end";
      }
      document.getElementById(
        `node-${node.row}-${node.col}`
      ).className = `node ${value}`;
    }
  }
};

const animateMaze = (state_grid, visitedNodesInOrder, maze_type) => {
  if (maze_type === constants.MAZE_RB) {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        const node = state_grid[i][j];
        if (node.isStart || node.isMid || node.isEnd) continue;
        setTimeout(() => {
          node.isWall = true;
          document.getElementById(`node-${i}-${j}`).className =
            "node node_wall_f";
        }, 10);
      }
    }
  }
  for (let i = 0; i < visitedNodesInOrder.length; i++) {
    const node = visitedNodesInOrder[i];
    const a_node = state_grid[node.row][node.col];
    if (a_node.isStart || a_node.isMid || a_node.isEnd) continue;
    if (maze_type !== constants.MAZE_RB) {
      setTimeout(() => {
        a_node.isWall = true;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node_wall_add";
      }, 10 * i);
    } else {
      setTimeout(() => {
        a_node.isWall = false;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node_wall_del";
      }, 20 * i);
    }
  }
};

/*
note:

* most important thing to remember is that assignments makes two variables 
point to the same memory address, and that my friend, is a real problem if
not handled carefully.
*/
