import React from "react";
import "./Node.css";
import * as constants from "../../Constants";

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
      onMouseClick,
      buttonPressed,
      isWall,
      isVisited,
      isStart,
      isEnd,
    } = this.props;

    let extra = "";
    if (isWall) extra = "node_wall_add";
    else if (isStart) extra = "node_start";
    else if (isEnd) extra = "node_end";
    else if (isVisited) extra = "node_vis";
    else extra = "";

    if (extra === "node_vis") console.log("yeah");
    if (
      buttonPressed === constants.ADD_WALL ||
      buttonPressed === constants.DONE ||
      buttonPressed === constants.DEL_WALL
    ) {
      return (
        <div
          id={`node-${row}-${col}`}
          className={`node ${extra}`}
          onMouseDown={() => onMouseDown(row, col)}
          onMouseEnter={() => onMouseEnter(row, col)}
          onMouseUp={() => onMouseUp()}
        ></div>
      );
    } else if (
      buttonPressed === constants.START ||
      buttonPressed === constants.END
    ) {
      return (
        <div
          id={`node-${row}-${col}`}
          className={`node ${extra}`}
          onClick={() => onMouseClick(row, col)}
        ></div>
      );
    } else {
      return <div id={`node-${row}-${col}`} className={`node ${extra}`}></div>;
    }
  }
}
