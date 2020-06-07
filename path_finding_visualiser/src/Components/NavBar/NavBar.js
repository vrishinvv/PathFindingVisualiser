import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import * as constants from "../../Constants";
export default class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      visualizeMaze1,
      visualizeMaze2,
      clearBoard,
      addStart,
      addEnd,
      addWall,
      delWall,
      visualizeDijkstras,
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
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Node Actions" id="collasible-nav-dropdown">
                <NavDropdown.Item
                  href="#action/3.3"
                  onClick={() => addStart(constants.START)}
                >
                  Add Start
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action/3.4"
                  onClick={() => addEnd(constants.END)}
                >
                  Add End
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
                    visualizeDijkstras(0, end_node_row, end_node_col)
                  }
                >
                  Dijkstra's Algorithm
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

            <Nav>
              <Nav.Link href="#deets">More deets</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Dank memes
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
