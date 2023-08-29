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
              Income and Bills Information (3/4)
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

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Vendor Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="billVendor"
                    defaultValue={this.props.values.billVendor}
                    onChange={this.props.handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Dollar Amount on Bill ($)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="500"
                      min="0"
                      name="billDollar"
                      defaultValue={this.props.values.billDollar}
                      onChange={this.props.handleChange}
                      required
                    ></Form.Control>
                    <InputGroup.Text>.00</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Family Name on Bill</Form.Label>
                  <Form.Control
                    type="text"
                    name="billFamily"
                    defaultValue={this.props.values.billFamily}
                    onChange={this.props.handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Account Number on Bill</Form.Label>
                  <Form.Control
                    type="text"
                    name="billAccount"
                    defaultValue={this.props.values.billAccount}
                    onChange={this.props.handleChange}
                    required
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group>
                  <Form.Label>Vendor Mailing Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="vendorAddress"
                    defaultValue={this.props.values.vendorAddress}
                    onChange={this.props.handleChange}
                    required
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="vendorCity"
                    defaultValue={this.props.values.vendorCity}
                    onChange={this.props.handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    defaultValue={this.props.values.vendorState}
                    onChange={this.props.handleChange}
                    name="vendorState"
                    required
                  >
                    <option>Choose...</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Zip</Form.Label>
                  <Form.Control
                    name="vendorZip"
                    defaultValue={this.props.values.vendorZip}
                    onChange={this.props.handleChange}
                    required
                  />
                </Form.Group>
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
    );
  }
}

export default IncomeInformation;
