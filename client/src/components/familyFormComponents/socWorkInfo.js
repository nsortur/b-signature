import React from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  ListGroup,
} from "react-bootstrap";

// page 4/4
class SocWorkInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showFillAlert: false };
    this.back = this.back.bind(this);
    this.submit = this.submit.bind(this);
  }

  back(event) {
    event.preventDefault();
    this.props.prevPage();
  }

  submit(event) {
    event.preventDefault();
    this.props.submitForm();
  }

  render() {
    let buttonDisp;
    let backDisp = (
      <Button variant="secondary" onClick={this.back} className="form-button">
        Previous Page
      </Button>
    );
    if (this.props.values.loadingSigning) {
      buttonDisp = (
        <Button variant="success" disabled>
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Button>
      );
      backDisp = null;
    } else {
      buttonDisp = (
        <Button
          variant="success"
          onClick={this.submit}
          className="form-button"
          type="submit"
        >
          Review and eSign
        </Button>
      );
    }

    let fillAlert;
    if (this.props.values.showFillAlert) {
      fillAlert = (
        <Alert
          variant="danger"
          onClose={this.props.dismissFillAlert}
          dismissible
        >
          <Alert.Heading>
            Please fill out or fix the following fields:
          </Alert.Heading>
          <ListGroup variant="flush">
            {this.props.values.fieldsNeedFilling.map((field, idx) => (
              <ListGroup.Item variant="danger" key={idx}>
                {field}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Alert>
      );
    }

    return (
      <Row>
        <Col></Col>
        <Col xs={8}>
          <Card className="input-card">
            <Card.Body>
              <Card.Title>Social Worker Information (4/4)</Card.Title>
              <Form>
                <Form.Group as={Col}>
                  <Form.Label>Social Worker Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Adam Smith"
                    name="socWorkName"
                    defaultValue={this.props.values.socWorkName}
                    onChange={this.props.handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Social Worker Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="socialworker@domain.com"
                    name="socWorkEmail"
                    defaultValue={this.props.values.socWorkEmail}
                    onChange={this.props.handleChange}
                    required
                  />
                </Form.Group>
                {backDisp}
                {buttonDisp}
              </Form>
            </Card.Body>
            <p style={{ color: "grey" }}>
              Note: Upon submission of this form, information will be stored.
            </p>
          </Card>
          {fillAlert}
        </Col>
        <Col></Col>
      </Row>
    );
  }
}

export default SocWorkInformation;
