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
      <Button
        variant="secondary"
        style={{ background: "#414141" }}
        onClick={this.back}
        className="form-button"
      >
        Previous Page
      </Button>
    );
    if (this.props.values.loadingSigning) {
      backDisp = null;
    }

    return (
      <Col sm={8}>
        <Card className="input-card">
          <Card.Body>
            <Card.Title style={{ textAlign: "center" }} className="page-title">
              Social Worker Information (4/4)
            </Card.Title>
            <Form>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Social Worker Name</Form.Label>
                <Form.Control
                  type="text"
                  name="socWorkName"
                  defaultValue={this.props.values.socWorkName}
                  onChange={this.props.handleChange}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} className="mb-3">
                <Form.Label>Social Worker Email</Form.Label>
                <Form.Control
                  type="email"
                  name="socWorkEmail"
                  defaultValue={this.props.values.socWorkEmail}
                  onChange={this.props.handleChange}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} className="mb-3">
                <Form.Label>Confirm Social Worker Email</Form.Label>
                <Form.Control
                  type="email"
                  name="socialWorkerEmailConfirm"
                  defaultValue={this.props.values.socialWorkerEmailConfirm}
                  onChange={this.props.handleChange}
                  required
                />
              </Form.Group>
              <p
                style={{ color: "#414141", fontSize: "20px" }}
                id="nav-buttons"
              >
                <b>
                  On the following page in the attachments box, please provide
                  bills <u>paid directly to the vendor</u> with the vendor name,
                  account number, mailing address, family's last name, and
                  dollar amount owed.
                </b>
                {/* Note: Upon submission of this form, information will be stored. */}
              </p>
              <div id="nav-buttons">
                {backDisp}
                {this.props.values.loadingSigning ? (
                  <Button
                    style={{ background: "#008046" }}
                    variant="success"
                    disabled
                  >
                    <Spinner animation="border" role="status" variant="light">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </Button>
                ) : (
                  <Button
                    style={{ background: "#008046" }}
                    variant="success"
                    onClick={this.submit}
                    className="form-button"
                    type="submit"
                  >
                    Review and eSign
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

export default SocWorkInformation;
