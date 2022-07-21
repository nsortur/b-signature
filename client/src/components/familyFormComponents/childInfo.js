import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";

// page 2/4
class ChildInformation extends React.Component {
  constructor(props) {
    super(props);
    this.continue = this.continue.bind(this);
    this.back = this.back.bind(this);
  }

  continue(event) {
    event.preventDefault();
    this.props.nextPage();
  }

  back(event) {
    event.preventDefault();
    this.props.prevPage();
  }

  render() {
    return (
      <Row>
        <Col></Col>
        <Col sm={8}>
          <Card className="input-card">
            <Card.Body>
              <Card.Title className="page-title">
                Child/Patient Information (2/4)
              </Card.Title>
              <Form>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Child's Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="John Doe"
                      name="childName"
                      defaultValue={this.props.values.childName}
                      onChange={this.props.handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Date of birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="childDOB"
                      onChange={this.props.handleChange}
                      defaultValue={this.props.values.childDOB}
                      required
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      onChange={this.props.handleChange}
                      defaultValue={this.props.values.childGender}
                      name="childGender"
                      required
                    >
                      <option>Choose...</option>
                      <option>Male</option>
                      <option>Female</option>
                    </Form.Select>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Ethnicity</Form.Label>
                    <Form.Select
                      onChange={this.props.handleChange}
                      defaultValue={this.props.values.childEthnicity}
                      name="childEthnicity"
                      required
                    >
                      <option>Choose...</option>
                      <option>African-American</option>
                      <option>Asian/Pacific Islander</option>
                      <option>Caucasian</option>
                      <option>Hispanic</option>
                      <option>Native American</option>
                      <option>Other</option>
                      <option>Prefer not to answer</option>
                    </Form.Select>
                    <Form.Text id="helpBlock">
                      <b>
                        Information will be used for statistical purposes only
                        and will not affect eligibility.
                      </b>
                    </Form.Text>
                  </Form.Group>
                  {this.props.values.otherEthSelected ? (
                    <Form.Group as={Col}>
                      <Form.Label>If other, please specify</Form.Label>
                      <Form.Control
                        type="text"
                        name="childEthnicity"
                        defaultValue={this.props.values.childEthnicity}
                        onChange={this.props.handleChange}
                        required
                      />
                    </Form.Group>
                  ) : (
                    <span></span>
                  )}
                </Row>
                <div id="nav-buttons">
                  <Button
                    variant="secondary"
                    style={{ background: "#414141" }}
                    onClick={this.back}
                    className="form-button"
                  >
                    Previous Page
                  </Button>
                  <Button
                    variant="success"
                    style={{ background: "#008046" }}
                    onClick={this.continue}
                    className="form-button"
                  >
                    Next Page
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col></Col>
      </Row>
    );
  }
}

export default ChildInformation;
