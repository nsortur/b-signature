import logo from "../../logo.png";
const React = require("react");
const { Navbar, Nav, NavDropdown, Container } = require("react-bootstrap");

const MyNav = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />{" "}
          Signature
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <NavDropdown title="Forms" id="basic-nav-dropdown">
              <NavDropdown.Item href="/family-form/">
                Family application
              </NavDropdown.Item>
              <NavDropdown.Item href="/medical-form/">
                Social worker
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="External resources" id="basic-nav-dropdown">
              <NavDropdown.Item href="https://bepositive.org">
                B+ Official
              </NavDropdown.Item>
              <NavDropdown.Item href="https://www.docusign.com/">
                DocuSign
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="https://github.com/nsortur/b-signature">
                Source code
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/admin">Admin</Nav.Link>
          </Nav>

          <Navbar.Collapse className="justify-content-end">
            <Nav.Link
              href="https://docusign2021.devpost.com"
              style={{ color: "#717172" }}
            >
              DocuSign Good Code Hackathon 2021
            </Nav.Link>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNav;
