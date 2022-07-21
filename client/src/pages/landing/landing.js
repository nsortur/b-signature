import React from "react";
import beposLogo from "../../beposLogo.png";
import {
  Button,
  Popover,
  OverlayTrigger,
  Container,
  Image,
  Row,
  Col,
} from "react-bootstrap";

class LandingPage extends React.Component {
  render() {
    const popover = (
      <Popover id="popover-basic">
        <Popover.Header as="h3">Criteria</Popover.Header>
        <Popover.Body>
          <ul style={{ fontFamily: "Century Gothic Regular" }}>
            <li>Have a child diagnosed with cancer under the age of 21</li>
            <li>
              Need assistance with expenses directly attributable to your
              child’s diagnosis
            </li>
            <li>
              Assistance may be granted one time in a 12-month period/2 times
              overall
            </li>
            <li>Receive treatment at any U.S. hospital</li>
            <li>We only pay creditors directly</li>
          </ul>
        </Popover.Body>
      </Popover>
    );
    return (
      <Container id="homeContainer">
        <Row>
          <Col>
            <div className="Landing-card">
              <h1>Receive Aid.</h1>
              <p>
                If your family is looking for financial assistance and meets the
                criteria specified by The B+ Foundation, you'll need to provide
                some information about you as a parent/guardian, and information
                about your child.{" "}
              </p>
            </div>

            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={popover}
            >
              <Button
                id="criteria"
                variant="outline-dark"
                size="lg"
                style={{
                  outline: "#414141",
                  fontFamily: "Rama Gothic E Semibold",
                }}
              >
                See criteria
              </Button>
            </OverlayTrigger>
            <Button
              href="/family-form/"
              size="lg"
              style={{
                background: "#008046",
                fontFamily: "Rama Gothic E Semibold",
              }}
              variant="success"
            >
              Get started
            </Button>
          </Col>
          <Col sm={7}>
            <Image src={beposLogo} className="App-logo" alt="logo" />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LandingPage;
