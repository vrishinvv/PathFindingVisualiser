import React from "react";
import "./App.css";
import Node from "./Components/Node/Node";
import { dijkstras, getNodesInShortestPathOrder } from "./Algorithm/Dijkstra";

const START_NODE_ROW = 15;
const START_NODE_COL = 20;
const END_NODE_ROW = 35;
const END_NODE_COL = 55;
const N = 40;
const M = 76;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  handleMouseDown = (row, col) => {
    if (this.state.mouseIsPressed === false)
      this.setState({ mouseIsPressed: true });
    getNewGridWithWallToggled(this.state.grid, row, col);
  };

  handleMouseEnter = (row, col) => {
    console.log("Enter");
    if (!this.state.mouseIsPressed) return;
    getNewGridWithWallToggled(this.state.grid, row, col);
  };

  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      console.log("here");
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node_vis";
      }, 10 * i);
    }
  }

  visualizeDijkstra() {
    const grid = JSON.parse(JSON.stringify(this.state.grid));

    const start_node = grid[START_NODE_ROW][START_NODE_COL];
    const end_node = grid[END_NODE_ROW][END_NODE_COL];

    const visitedNodesInOrder = dijkstras(grid, start_node, end_node);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(end_node);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  componentDidMount() {
    const g = initialiseGrid();
    this.setState({ grid: g });
  }

  clearBoard = () => {
    const g = initialiseGrid();
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        document.getElementById(`node-${i}-${j}`).classList = "node";
      }
    }
    document.getElementById(
      `node-${START_NODE_ROW}-${START_NODE_COL}`
    ).classList = "node node_start";
    document.getElementById(`node-${END_NODE_ROW}-${END_NODE_COL}`).classList =
      "node node_end";
    this.setState({ grid: g, mouseIsPressed: false });
  };

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <div className="grid">
        <button onClick={() => this.visualizeDijkstra()}>
          Visualise Dijkstra Algorithm
        </button>
        <button onClick={() => this.clearBoard()}>Clear Board</button>
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isEnd, isStart, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                    row={row}
                    col={col}
                    isStart={isStart}
                    isEnd={isEnd}
                    isVisited={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                  ></Node>
                );
              })}
            </div>
          );
        })}
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

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isEnd: row === END_NODE_ROW && col === END_NODE_COL,
    distance: 1000000000,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const node = grid[row][col];
  node.isWall = !node.isWall;
  if (node.isWall)
    document.getElementById(`node-${node.row}-${node.col}`).classList =
      "node node_wall";
  else
    document.getElementById(`node-${node.row}-${node.col}`).classList = "node";
};
