import React from "react";
import { Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";

// page 3/4
class IncomeInformation extends React.Component {
  constructor(props) {
    super(props);
    this.back = this.back.bind(this);
    this.continue = this.continue.bind(this);
  }

  back(event) {
    event.preventDefault();
    this.props.prevPage();
  }

  continue(event) {
    event.preventDefault();
    this.props.nextPage();
  }

  render() {
    return (
      <Col sm={8}>
        <Card className="input-card">
          <Card.Body>
            <Card.Title className="page-title">
              Income Information (3/4)
            </Card.Title>
            <Form>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Annual Income ($)</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    step="500"
                    min="0"
                    name="annualIncome"
                    defaultValue={this.props.values.annualIncome}
                    onChange={this.props.handleChange}
                    required
                  ></Form.Control>
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
                <Form.Text id="helpBlock">
                  <b>
                    i.e. government assistance, child support, alimony, family
                    assistance,{" "}
                    <u>all sources of income to pay living expenses</u>
                  </b>
                </Form.Text>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Request Grant Amount ($)</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    step="500"
                    min="0"
                    name="requestedGrant"
                    defaultValue={this.props.values.requestedGrant}
                    onChange={this.props.handleChange}
                    required
                  ></Form.Control>
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Intended Use of Grant</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  type="text"
                  name="intendedUse"
                  defaultValue={this.props.values.intendedUse}
                  onChange={this.props.handleChange}
                  required
                />
                {/* <Form.Text>
                    <b>
                      Please provide bills <u>paid directly to the vendor</u>{" "}
                      with the vendor name, account number, mailing address,
                      family's last name, and dollar amount owed.
                    </b>
                  </Form.Text> */}
              </Form.Group>
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
    );
  }
}

export default IncomeInformation;
