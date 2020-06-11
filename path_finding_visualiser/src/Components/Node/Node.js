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
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      isWall,
      isVisited,
      isVisited2,
      isShortest,
      isStart,
      isEnd,
      isMid,
    } = this.props;

    let extra = "";

    if (isShortest && isStart) extra = "node_start node-shortest-path-2";
    else if (isShortest && isMid) extra = "node_mid node-shortest-path-2";
    else if (isShortest && isEnd) extra = "node_end node-shortest-path-2";
    else if (isWall) extra = "node_wall_add";
    else if (isStart) extra = "node_start";
    else if (isEnd) extra = "node_end";
    else if (isShortest) extra = "node-shortest-path_f";
    else if (isVisited2) extra = "node_vis_f_2";
    else if (isVisited) extra = "node_vis_f";
    else if (isMid) extra = "node_mid";
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
