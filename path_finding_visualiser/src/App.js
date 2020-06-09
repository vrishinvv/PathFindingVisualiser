import React from "react";
import "./App.css";
import Node from "./Components/Node/Node";
import { dijkstras, getNodesInShortestPathOrder } from "./Algorithm/Dijkstra";
import {
  solve_dfs,
  getNodesInShortestPathOrderDFS,
} from "./Algorithm/DepthFirstSearch";
import {
  solve_bfs,
  getNodesInShortestPathOrderBFS,
} from "./Algorithm/BreadthFirstSearch";

import {
  solve_mbfs,
  getNodesInShortestPathOrderMBFS,
} from "./Algorithm/MultiSourceBFS";

import {
  solve_astar,
  getNodesInShortestPathOrderASTAR,
} from "./Algorithm/ASearch";

import { getNodesInOrder } from "./MazeBuilder/RecursiveDivision";
import NavBar from "./Components/NavBar/NavBar";
import { solve } from "./MazeBuilder/RecursiveBacktracker";
import * as constants from "./Constants";
import "bootstrap/dist/css/bootstrap.min.css";

let START_NODE_ROW = 5;
let START_NODE_COL = 10;
let END_NODE_ROW = 5;
let END_NODE_COL = 20;
let MID_NODE_ROW = -1;
let MID_NODE_COL = -1;
const N = 27;
const M = 75;
let cur_row = -1;
let cur_col = -1;
let algo;
var Preserved = [];
var buttonPressed = constants.NONE;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  handleMouseDown = (row, col) => {
    if (row === cur_row && col === cur_col) return;
    //if (this.state.mouseIsPressed === false)
    this.setState({ mouseIsPressed: true });
    console.log("before: ", buttonPressed, this.state.mouseIsPressed);
    if (buttonPressed !== constants.DONE) {
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
    }

    console.log("after: ", buttonPressed, this.state.mouseIsPressed);
    switch (buttonPressed) {
      case constants.ADD_WALL: {
        add_wall_to_grid(this.state.grid, row, col);
        break;
      }
      case constants.DEL_WALL: {
        del_wall_from_grid(this.state.grid, row, col);
        break;
      }
      case constants.DONE: {
        if (this.state.grid[row][col].isWall) return;
        this.visualizeAlgorithm(1, row, col, algo);
        break;
      }

      case constants.START: {
        change_start_node(this.state.grid, row, col);
        break;
      }
      case constants.END: {
        change_end_node(this.state.grid, row, col);
        break;
      }
      case constants.MID: {
        change_mid_node(this.state.grid, row, col);
        break;
      }
      case constants.ADD_MID: {
        this.add_mid_node(this.state.grid, row, col);
        break;
      }
      case constants.DEL_MID: {
        this.del_mid_node(this.state.grid, row, col);
        break;
      }
      default:
        break;
    }

    cur_row = row;
    cur_col = col;
  };

  handleMouseEnter = (row, col) => {
    if (row === cur_row && col === cur_col) return;
    if (!this.state.mouseIsPressed) return;

    switch (buttonPressed) {
      case constants.ADD_WALL: {
        add_wall_to_grid(this.state.grid, row, col);
        break;
      }
      case constants.DEL_WALL: {
        del_wall_from_grid(this.state.grid, row, col);
        break;
      }
      case constants.DONE: {
        if (this.state.grid[row][col].isWall) return;
        this.visualizeAlgorithm(1, row, col, algo);
        break;
      }
      case constants.START: {
        change_start_node(this.state.grid, row, col);
        break;
      }
      case constants.END: {
        change_end_node(this.state.grid, row, col);
        break;
      }
      case constants.MID: {
        change_mid_node(this.state.grid, row, col);
        break;
      }
      case constants.ADD_MID: {
        this.add_mid_node(this.state.grid, row, col);
        break;
      }
      case constants.DEL_MID: {
        this.del_mid_node(this.state.grid, row, col);
        break;
      }
      default:
        break;
    }
    cur_row = row;
    cur_col = col;
  };

  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };

  handleChoice = (ch) => {
    if (buttonPressed === ch) buttonPressed = constants.NONE;
    else buttonPressed = ch;
  };

  handlePreserveChange = (preserved_data) => {
    Preserved = preserved_data;
  };

  animateShortestPath = (nodesInShortestPathOrder, type) => {
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
    if (type === 0) {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          const orig_node = this.state.grid[node.row][node.col];
          orig_node.isShortest = orig_node.isVisited = true;

          let value = "";
          if (i >= m) {
            value = "node-shortest-path-2";
          } else {
            value = "node-shortest-path";
          }
          document.getElementById(
            `node-${node.row}-${node.col}`
          ).className = `node ${value}`;
        }, 20 * i);
      }
    } else {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        const node = nodesInShortestPathOrder[i];
        const orig_node = this.state.grid[node.row][node.col];
        orig_node.isShortest = orig_node.isVisited = true;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path_f";
      }
    }
  };

  animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder, type) => {
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
    if (type === 0) {
      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        // use to color the final path, yellow in the end
        if (i === visitedNodesInOrder.length) {
          setTimeout(() => {
            this.animateShortestPath(nodesInShortestPathOrder, type);
          }, 10 * i);
          return;
        }

        //yellow blinker to indicate current position
        setTimeout(() => {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node_current";
        }, 10 * i - 15);
        setTimeout(() => {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
        }, 10 * i - 5);

        const node = visitedNodesInOrder[i];
        let value = "";
        if (i >= m) {
          value = "node_vis_2";
        } else {
          value = "node_vis";
        }

        //used to color the visited grids in order
        setTimeout(() => {
          const orig_node = this.state.grid[node.row][node.col];
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
          this.animateShortestPath(nodesInShortestPathOrder, type);
          return;
        }

        const node = visitedNodesInOrder[i];
        const orig_node = this.state.grid[node.row][node.col];
        let value = "";
        if (i >= m) {
          value = "node_vis_f_2";
          orig_node.isVisited2 = true;
        } else {
          value = "node_vis_f";
          orig_node.isVisited = true;
        }
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = `node ${value}`;
      }
    }
  };

  handleAlgorithm = (row, col, algo_type) => {
    // creating a DEEP Copy, very important step
    // creating a shall copy, wud have made all changes to state during dijkstras itself
    var grid = JSON.parse(JSON.stringify(this.state.grid));
    var start_node = grid[START_NODE_ROW][START_NODE_COL];
    var end_node = grid[row][col];
    var visitedNodesInOrder = [];
    var visitedNodesInOrder2 = [];
    var nodesInShortestPathOrder = [];
    var nodesInShortestPathOrder2 = [];
    var mid_node = createNode();
    mid_node.row = MID_NODE_ROW;
    mid_node.row = MID_NODE_COL;

    switch (algo_type) {
      case constants.DIJK: {
        if (MID_NODE_ROW === -1) {
          visitedNodesInOrder = dijkstras(grid, start_node, end_node);
          nodesInShortestPathOrder = getNodesInShortestPathOrder(end_node);
        } else {
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          visitedNodesInOrder = dijkstras(grid, start_node, mid_node);
          nodesInShortestPathOrder = getNodesInShortestPathOrder(mid_node);
          grid = JSON.parse(JSON.stringify(this.state.grid));
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          end_node = grid[row][col];
          visitedNodesInOrder2 = dijkstras(grid, mid_node, end_node);
          nodesInShortestPathOrder2 = getNodesInShortestPathOrder(end_node);

          for (let i in visitedNodesInOrder2) {
            visitedNodesInOrder.push(visitedNodesInOrder2[i]);
          }
          for (let i in nodesInShortestPathOrder2) {
            nodesInShortestPathOrder.push(nodesInShortestPathOrder2[i]);
          }
        }
        break;
      }
      case constants.DFS_NORM: {
        if (MID_NODE_ROW === -1) {
          visitedNodesInOrder = solve_dfs(grid, start_node, end_node, 1);
          nodesInShortestPathOrder = getNodesInShortestPathOrderDFS();
        } else {
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          visitedNodesInOrder = solve_dfs(grid, start_node, mid_node, 1);
          nodesInShortestPathOrder = getNodesInShortestPathOrderDFS(mid_node);
          grid = JSON.parse(JSON.stringify(this.state.grid));
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          end_node = grid[row][col];
          visitedNodesInOrder2 = solve_dfs(grid, mid_node, end_node, 1);
          nodesInShortestPathOrder2 = getNodesInShortestPathOrderDFS(end_node);

          for (let i in visitedNodesInOrder2) {
            visitedNodesInOrder.push(visitedNodesInOrder2[i]);
          }
          for (let i in nodesInShortestPathOrder2) {
            nodesInShortestPathOrder.push(nodesInShortestPathOrder2[i]);
          }
        }
        break;
      }
      case constants.DFS_RAND: {
        if (MID_NODE_ROW === -1) {
          visitedNodesInOrder = solve_dfs(grid, start_node, end_node, 0);
          nodesInShortestPathOrder = getNodesInShortestPathOrderDFS();
        } else {
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          visitedNodesInOrder = solve_dfs(grid, start_node, mid_node, 0);
          nodesInShortestPathOrder = getNodesInShortestPathOrderDFS(mid_node);
          grid = JSON.parse(JSON.stringify(this.state.grid));
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          end_node = grid[row][col];
          visitedNodesInOrder2 = solve_dfs(grid, mid_node, end_node, 0);
          nodesInShortestPathOrder2 = getNodesInShortestPathOrderDFS(end_node);

          for (let i in visitedNodesInOrder2) {
            visitedNodesInOrder.push(visitedNodesInOrder2[i]);
          }
          for (let i in nodesInShortestPathOrder2) {
            nodesInShortestPathOrder.push(nodesInShortestPathOrder2[i]);
          }
        }
        break;
      }
      case constants.BFS: {
        if (MID_NODE_ROW === -1) {
          visitedNodesInOrder = solve_bfs(grid, start_node, end_node);
          nodesInShortestPathOrder = getNodesInShortestPathOrderBFS(end_node);
        } else {
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          visitedNodesInOrder = solve_bfs(grid, start_node, mid_node);
          nodesInShortestPathOrder = getNodesInShortestPathOrderBFS(mid_node);
          grid = JSON.parse(JSON.stringify(this.state.grid));
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          end_node = grid[row][col];
          visitedNodesInOrder2 = solve_bfs(grid, mid_node, end_node);
          nodesInShortestPathOrder2 = getNodesInShortestPathOrderBFS(end_node);

          for (let i in visitedNodesInOrder2) {
            visitedNodesInOrder.push(visitedNodesInOrder2[i]);
          }
          for (let i in nodesInShortestPathOrder2) {
            nodesInShortestPathOrder.push(nodesInShortestPathOrder2[i]);
          }
        }
        break;
      }
      case constants.MBFS: {
        if (MID_NODE_ROW === -1) {
          visitedNodesInOrder = solve_mbfs(grid, start_node, end_node);
          nodesInShortestPathOrder = getNodesInShortestPathOrderMBFS();
        } else {
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          visitedNodesInOrder = solve_mbfs(grid, start_node, mid_node);
          nodesInShortestPathOrder = getNodesInShortestPathOrderMBFS(mid_node);
          grid = JSON.parse(JSON.stringify(this.state.grid));
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          end_node = grid[row][col];
          visitedNodesInOrder2 = solve_mbfs(grid, mid_node, end_node);
          nodesInShortestPathOrder2 = getNodesInShortestPathOrderMBFS(end_node);

          for (let i in visitedNodesInOrder2) {
            visitedNodesInOrder.push(visitedNodesInOrder2[i]);
          }
          for (let i in nodesInShortestPathOrder2) {
            nodesInShortestPathOrder.push(nodesInShortestPathOrder2[i]);
          }
        }
        break;
      }
      case constants.ASTAR: {
        if (MID_NODE_ROW === -1) {
          visitedNodesInOrder = solve_astar(grid, start_node, end_node);
          nodesInShortestPathOrder = getNodesInShortestPathOrderASTAR(end_node);
        } else {
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          visitedNodesInOrder = solve_astar(grid, start_node, mid_node);
          nodesInShortestPathOrder = getNodesInShortestPathOrderASTAR(mid_node);
          grid = JSON.parse(JSON.stringify(this.state.grid));
          mid_node = grid[MID_NODE_ROW][MID_NODE_COL];
          end_node = grid[row][col];
          visitedNodesInOrder2 = solve_astar(grid, mid_node, end_node);
          nodesInShortestPathOrder2 = getNodesInShortestPathOrderASTAR(
            end_node
          );

          for (let i in visitedNodesInOrder2) {
            visitedNodesInOrder.push(visitedNodesInOrder2[i]);
          }
          for (let i in nodesInShortestPathOrder2) {
            nodesInShortestPathOrder.push(nodesInShortestPathOrder2[i]);
          }
        }
        break;
      }
      default:
        break;
    }
    return [visitedNodesInOrder, nodesInShortestPathOrder];
  };

  visualizeAlgorithm = (type, row, col, algo_type) => {
    algo = algo_type;
    if (type === 1) clear_all(this.state.grid);
    else clear_clever(this.state.grid);
    const ret = this.handleAlgorithm(row, col, algo);
    const visitedNodesInOrder = ret[0];
    const nodesInShortestPathOrder = ret[1];
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, type);
    if (buttonPressed !== constants.DONE) buttonPressed = constants.DONE;
  };

  visualizeMaze1 = () => {
    this.clearBoard();
    const grid = JSON.parse(JSON.stringify(this.state.grid));
    const visitedNodesInOrder = getNodesInOrder(grid, 0, N - 1, 0, M - 1);
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      const a_node = this.state.grid[node.row][node.col];
      if (a_node.isStart || a_node.isMid || a_node.isEnd) continue;
      setTimeout(() => {
        a_node.isWall = true;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node_wall_add";
      }, 10 * i);
    }
  };

  visualizeMaze2 = () => {
    this.clearBoard();
    const grid = JSON.parse(JSON.stringify(this.state.grid));
    const visitedNodesInOrder = solve(grid, 0, N - 1, 0, M - 1);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        const node = this.state.grid[i][j];
        if (node.isStart || node.isMid || node.isEnd) continue;
        setTimeout(() => {
          node.isWall = true;
          document.getElementById(`node-${i}-${j}`).className =
            "node node_wall_f";
        }, 10);
      }
    }

    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      const a_node = this.state.grid[node.row][node.col];
      if (a_node.isStart || a_node.isMid || a_node.isEnd) continue;
      setTimeout(() => {
        a_node.isWall = false;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node_wall_del";
      }, 20 * i);
    }
  };

  componentDidMount() {
    const g = initialiseGrid();
    this.setState({ grid: g });
  }

  add_mid_node = () => {
    const grid = this.state.grid;
    MID_NODE_ROW = 10;
    MID_NODE_COL = 30;
    console.log("here");
    const node = grid[MID_NODE_ROW][MID_NODE_COL];
    node.isMid = true;
    node.isWall = false;
    document.getElementById(`node-${MID_NODE_ROW}-${MID_NODE_COL}`).className =
      "node node_mid";
  };

  del_mid_node = () => {
    const grid = this.state.grid;
    const node = grid[MID_NODE_ROW][MID_NODE_COL];
    node.isMid = false;
    document.getElementById(`node-${MID_NODE_ROW}-${MID_NODE_COL}`).className =
      "node";
    MID_NODE_ROW = MID_NODE_COL = -1;
  };

  clearBoard = () => {
    const g = this.state.grid.slice();

    START_NODE_ROW = 5;
    START_NODE_COL = 10;
    END_NODE_ROW = 5;
    END_NODE_COL = 20;
    MID_NODE_ROW = MID_NODE_COL = cur_row = cur_col = -1;

    buttonPressed = constants.NONE;
    this.setState({ mouseIsPressed: false });
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        var node = g[i][j];

        if (Preserved.includes(constants.PRESERVE_WALLS)) {
          if (node.isWall === true) continue;
        }
        if (Preserved.includes(constants.PRESERVE_START)) {
          if (node.isStart === true) {
            document.getElementById(`node-${i}-${j}`).className =
              "node node_start";
            continue;
          }
        }
        if (Preserved.includes(constants.PRESERVE_END)) {
          if (node.isEnd === true) {
            document.getElementById(`node-${i}-${j}`).className =
              "node node_end";
            continue;
          }
        }
        if (Preserved.includes(constants.PRESERVE_VIS)) {
          if (node.isVisited === true) continue;
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

  render() {
    const { grid, mouseIsPressed, buttonPressed } = this.state;
    return (
      <div>
        <NavBar
          visualizeMaze1={this.visualizeMaze1}
          visualizeMaze2={this.visualizeMaze2}
          clearBoard={this.clearBoard}
          addStart={this.handleChoice}
          addMid={this.add_mid_node}
          delMid={this.del_mid_node}
          addEnd={this.handleChoice}
          addWall={this.handleChoice}
          delWall={this.handleChoice}
          visualizeAlgorithm={this.visualizeAlgorithm}
          start_node_row={START_NODE_ROW}
          start_node_col={START_NODE_COL}
          end_node_row={END_NODE_ROW}
          end_node_col={END_NODE_COL}
          handlePreserveChange={this.handlePreserveChange}
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
  document.getElementById(`node-${row}-${col}`).className = "node node_start";
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

/*
note:

* most important thing to remember is that assignments makes two variables 
point to the same memory address, and that my friend, is a real problem if
not handled carefully.
*/
