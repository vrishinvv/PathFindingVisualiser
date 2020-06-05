import React from "react";
import "./Node.css";
export default class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      row,
      col,
      isStart,
      isEnd,
      isVisited,
      isWall,
      mouseIsPressed,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;

    let extra = "";
    if (isStart) extra = "node_start";
    else if (isEnd) extra = "node_end";
    else if (isVisited) extra = "node_vis";
    else if (isWall) extra = "node_wall";
    else extra = "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extra}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}
