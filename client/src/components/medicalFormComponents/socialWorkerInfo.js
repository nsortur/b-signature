import React from "react";
import { Form, Card, Row, Col, Button } from "react-bootstrap";

// page 1/2
class SocialWorkerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.continue = this.continue.bind(this);
  }

  continue(event) {
    event.preventDefault();
    this.props.nextPage();
  }

  render() {
    return (
      <Row>
        <Col></Col>
        <Col xs={8}>
          <Card className="input-card">
            <Card.Body>
              <Card.Title>Social Worker Information (1/3)</Card.Title>
              <Form>
                <Form.Group as={Col}>
                  <Form.Label>Name and Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Adam Smith"
                    name="socialWorkerName"
                    defaultValue={this.props.values.socialWorkerName}
                    onChange={this.props.handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    name="socialWorkerEmail"
                    defaultValue={this.props.values.socialWorkerEmail}
                    onChange={this.props.handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Phone and Extension</Form.Label>
                  <Form.Control
                    name="socialWorkerPhone"
                    placeholder="(555) 555-1212, ext. 766"
                    defaultValue={this.props.values.socialWorkerPhone}
                    onChange={this.props.handleChange}
                    required
                  />
                  <Form.Text>
                    This form is <u>only</u> to be completed by a social worker.{" "}
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="success"
                  onClick={this.continue}
                  className="form-button"
                >
                  Next Page
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col></Col>
      </Row>
    );
  }
}

export default SocialWorkerInfo;
