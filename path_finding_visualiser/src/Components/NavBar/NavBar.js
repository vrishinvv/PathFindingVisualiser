import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import * as constants from "../../Constants";
var preserved = [];
export default class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleStatus = (a) => {
    if (preserved.includes(a)) {
      preserved = preserved.filter((num) => {
        return num !== a;
      });
    } else {
      preserved.push(a);
    }
    this.props.handlePreserveChange(preserved);
  };

  /* componentDidMount() {
    document.getElementById("checkbox-1").checked = true;
  } */
  render() {
    const {
      visualizeMaze1,
      visualizeMaze2,
      visualizeMaze3,
      clearBoard,
      addMid,
      delMid,
      addWall,
      delWall,
      visualizeAlgorithm,
      end_node_row,
      end_node_col,
    } = this.props;
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">Path VVVisualiser</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#pricing" onClick={() => clearBoard()}>
                Clear Board
              </Nav.Link>
              <NavDropdown title="Maze Algorithms" id="collasible-nav-dropdown">
                <NavDropdown.Item
                  href="#action/3.1"
                  onClick={() => visualizeMaze1()}
                >
                  Recursive Division
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/3.2"
                  onClick={() => visualizeMaze2()}
                >
                  Recursive Backtracking
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/3.22"
                  onClick={() => visualizeMaze3()}
                >
                  Random Walls
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Node Actions" id="collasible-nav-dropdown">
                <NavDropdown.Item
                  href="#action/3.11"
                  onClick={() => addMid(constants.ADD_MID)}
                >
                  Add Mid
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/3.12"
                  onClick={() => delMid(constants.DEL_MID)}
                >
                  Delete Mid
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/3.5"
                  onClick={() => addWall(constants.ADD_WALL)}
                >
                  Add Wall
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/3.6"
                  onClick={() => delWall(constants.DEL_WALL)}
                >
                  Delete Wall
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Algorithms" id="collasible-nav-dropdown">
                <NavDropdown.Item
                  href="#action/3.7"
                  onClick={() =>
                    visualizeAlgorithm(
                      0,
                      end_node_row,
                      end_node_col,
                      constants.DIJK
                    )
                  }
                >
                  Dijkstra's
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/3.8"
                  onClick={() =>
                    visualizeAlgorithm(
                      0,
                      end_node_row,
                      end_node_col,
                      constants.DFS_NORM,
                      1
                    )
                  }
                >
                  Depth First Search - Normal
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/3.9"
                  onClick={() =>
                    visualizeAlgorithm(
                      0,
                      end_node_row,
                      end_node_col,
                      constants.DFS_RAND
                    )
                  }
                >
                  Depth First Search - Randomised
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/4.0"
                  onClick={() =>
                    visualizeAlgorithm(
                      0,
                      end_node_row,
                      end_node_col,
                      constants.BFS
                    )
                  }
                >
                  Breadth First Search - Normal
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/4.1"
                  onClick={() =>
                    visualizeAlgorithm(
                      0,
                      end_node_row,
                      end_node_col,
                      constants.MBFS
                    )
                  }
                >
                  Breadth First Search - Multi Source
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/4.2"
                  onClick={() =>
                    visualizeAlgorithm(
                      0,
                      end_node_row,
                      end_node_col,
                      constants.ASTAR
                    )
                  }
                >
                  A* Algorithm
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

            <Nav>
              <NavDropdown title="Preserve" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/5.4">
                  <Form>
                    <div key={`checkbox`} className="mb-3">
                      <Form.Check
                        label="Walls"
                        type="checkbox"
                        id="checkbox-2"
                        onClick={() =>
                          this.handleStatus(constants.PRESERVE_WALLS)
                        }
                      />
                    </div>
                  </Form>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
