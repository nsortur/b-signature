import logo from "../../logo.png";
const React = require("react");
const { Navbar, Nav, NavDropdown, Container } = require("react-bootstrap");

const MyNav = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={logo}
            width="34"
            height="34"
            className="d-inline-block align-top"
            alt=""
          />{" "}
          Signature
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">
              <span style={{ color: "#414141" }}>Home</span>
            </Nav.Link>
            <Nav.Link href="/family-form">
              <span style={{ color: "#414141" }}>Application</span>
            </Nav.Link>
            <span style={{ color: "#414141" }}>
              <NavDropdown title="External resources" id="basic-nav-dropdown">
                <NavDropdown.Item href="https://www.bepositive.org/">
                  <span style={{ color: "#414141" }}>B+ Official</span>
                </NavDropdown.Item>
                <NavDropdown.Item href="https://www.docusign.com/">
                  <span style={{ color: "#414141" }}>DocuSign</span>
                </NavDropdown.Item>
              </NavDropdown>
            </span>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNav;
