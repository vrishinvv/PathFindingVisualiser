import React from "react";
import "./App.css";
import Node from "./Components/Node/Node";
import { dijkstras, getNodesInShortestPathOrder } from "./Algorithm/Dijkstra";
import { getNodesInOrder } from "./MazeBuilder/RecursiveDivision";
import NavBar from "./Components/NavBar/NavBar";

import { solve } from "./MazeBuilder/RecursiveBacktracker";

import * as constants from "./Constants";

import "bootstrap/dist/css/bootstrap.min.css";

let START_NODE_ROW = -1;
let START_NODE_COL = -1;
let END_NODE_ROW = -1;
let END_NODE_COL = -1;
const N = 31;
const M = 75;
let cur_row = -1;
let cur_col = -1;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      buttonPressed: 0,
    };
  }

  handleMouseDown = (row, col) => {
    if (row === cur_row && col === cur_col) return;
    if (this.state.mouseIsPressed === false)
      this.setState({ mouseIsPressed: true });

    switch (this.state.buttonPressed) {
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
        this.visualizeDijkstra(1, row, col);
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

    switch (this.state.buttonPressed) {
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
        this.visualizeDijkstra(1, row, col);
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
    if (this.state.buttonPressed === ch)
      this.setState({ buttonPressed: constants.NONE });
    else this.setState({ buttonPressed: ch });
  };

  handleMouseClick = (row, col) => {
    const g = this.state.grid;
    var node = g[row][col];
    if (this.state.buttonPressed === constants.START) {
      var pnode;
      if (START_NODE_ROW !== -1) {
        pnode = g[START_NODE_ROW][START_NODE_COL];
        pnode.className = "node";
        pnode.isStart = false;
      }
      if (pnode === node) {
        START_NODE_ROW = START_NODE_COL = -1;
        return;
      }
      node.className = "node node_start";
      node.isStart = true;
      START_NODE_ROW = row;
      START_NODE_COL = col;
    } else if (this.state.buttonPressed === constants.END) {
      if (END_NODE_ROW !== -1) {
        pnode = g[END_NODE_ROW][END_NODE_COL];
        pnode.className = "node";
        pnode.isEnd = false;
      }

      if (pnode === node) {
        END_NODE_ROW = END_NODE_COL = 1;
        return;
      }
      node.className = "node node_end";
      node.isEnd = true;
      END_NODE_ROW = row;
      END_NODE_COL = col;
    } else {
      //anything else?
    }
    this.setState({ grid: g });
  };

  animateShortestPath = (nodesInShortestPathOrder, type) => {
    if (type === 0) {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }, 50 * i);
      }
    } else {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path_f";
      }
    }
  };

  animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder, type) => {
    if (type === 0) {
      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        // use to color the final path, yellow in the end
        if (i === visitedNodesInOrder.length) {
          setTimeout(() => {
            this.animateShortestPath(nodesInShortestPathOrder, type);
          }, 10 * i);
          return;
        }
        //used to color the visited grids in order
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node_vis";
        }, 10 * i);
      }
    } else {
      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
          this.animateShortestPath(nodesInShortestPathOrder, type);
          return;
        }
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node_vis_f";
      }
    }
  };

  visualizeDijkstra = (type, row, col) => {
    if (type === 1) clear_all(this.state.grid);
    // creating a DEEP Copy, very important step
    // creating a shall copy, wud have made all changes to state during dijkstras itself
    const grid = JSON.parse(JSON.stringify(this.state.grid));
    const start_node = grid[START_NODE_ROW][START_NODE_COL];
    const end_node = grid[row][col];
    // Using dijstrak's methods to get direst results
    const visitedNodesInOrder = dijkstras(grid, start_node, end_node);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(end_node);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, type);
    if (this.state.buttonPressed !== constants.DONE)
      this.setState({ buttonPressed: constants.DONE });
  };

  visualizeMaze1 = () => {
    console.log("hey there");
    this.clearBoard();
    const grid = JSON.parse(JSON.stringify(this.state.grid));
    const visitedNodesInOrder = getNodesInOrder(grid, 0, N - 1, 0, M - 1);
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const a_node = this.state.grid[node.row][node.col];
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
        setTimeout(() => {
          const node = this.state.grid[i][j];
          node.isWall = true;
          document.getElementById(`node-${i}-${j}`).className =
            "node node_wall_f";
        }, 10);
      }
    }

    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const a_node = this.state.grid[node.row][node.col];
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

  clearBoard = () => {
    const g = this.state.grid.slice();
    START_NODE_ROW = START_NODE_COL = END_NODE_ROW = END_NODE_COL = cur_row = cur_col = -1;
    this.setState({ buttonPressed: constants.NONE });
    this.setState({ mouseIsPressed: false });
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        document.getElementById(`node-${i}-${j}`).className = "node";
        var node = g[i][j];
        node.row = i;
        node.col = j;
        node.isStart = false;
        node.isEnd = false;
        node.isWall = false;
        node.isVisited = false;
        node.distance = 1000000000;
        node.previousNode = null;
      }
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
          addEnd={this.handleChoice}
          addWall={this.handleChoice}
          delWall={this.handleChoice}
          visualizeDijkstras={this.visualizeDijkstra}
          end_node_row={END_NODE_ROW}
          end_node_col={END_NODE_COL}
        />

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isEnd, isStart, isWall, isVisited } = node;
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
                      isVisited={isVisited}
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
    isStart: false,
    isEnd: false,
    distance: 1000000000, //unable to use Infinity here, cos deep copy does not work with infinity
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const add_wall_to_grid = (grid, row, col) => {
  const node = grid[row][col];
  if (node.isWall) return;
  document.getElementById(`node-${node.row}-${node.col}`).className =
    "node node_wall_add";
  node.isWall = true;
};

const del_wall_from_grid = (grid, row, col) => {
  const node = grid[row][col];
  if (!node.isWall) return;
  node.wasWall = true;
  node.isWall = false;
  document.getElementById(`node-${node.row}-${node.col}`).className =
    "node node_wall_del";
};

const clear_all = (grid) => {
  cur_row = cur_col = -1;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (grid[i][j].isWall) continue;
      document.getElementById(`node-${i}-${j}`).className = "node";
    }
  }
};

/*
note:

* most important thing to remember is that assignments makes two variables 
point to the same memory address, and that my friend, is a real problem if
not handled carefully.
*/
