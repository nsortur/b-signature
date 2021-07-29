import logo from '../../logo.png';
const React = require("react");
const { Navbar, Nav, NavDropdown, Container} = require("react-bootstrap");

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
        />{' '}
      Signature
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" >
          <Nav.Link href='/'>
            Home
          </Nav.Link>
          <Nav.Link href='/form/'>
            Form
          </Nav.Link>
          <NavDropdown title="External resources" id="basic-nav-dropdown">
            <NavDropdown.Item href='https://bepositive.org'>B+ Official</NavDropdown.Item>
            <NavDropdown.Item href='https://www.docusign.com/'>DocuSign</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="https://github.com/nsortur/b-connected">Source code</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        {/* <Navbar.Text>
          Signed in as: <a href="#login">John Doe</a>
        </Navbar.Text> */}
      </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default MyNav;