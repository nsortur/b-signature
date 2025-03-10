import React from "react";
import { Col, Card, Form, Button, InputGroup, Accordion } from "react-bootstrap";

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

            {/* Main Form */}
            <Form>
              <Form.Group as={Col} className="mb-3">
                <Form.Label htmlFor="annualIncome">Annual Income ($)</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    id="annualIncome"
                    type="number"
                    step="500"
                    min="0"
                    name="annualIncome"
                    defaultValue={this.props.values.annualIncome}
                    onChange={this.props.handleChange}
                    required
                  />
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
                <Form.Text id="helpBlock">
                  <b>
                    i.e. government assistance, child support, alimony, family assistance,{" "}
                    <u>all sources of income to pay living expenses</u>
                  </b>
                </Form.Text>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label htmlFor="requestedGrant">Request Grant Amount ($)</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    id="requestedGrant"
                    type="number"
                    step="500"
                    min="0"
                    name="requestedGrant"
                    defaultValue={this.props.values.requestedGrant}
                    onChange={this.props.handleChange}
                    required
                  />
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <h5>Vendors</h5>

              
              <Accordion activeKey={this.props.values.activeKey} onSelect={this.props.toggleAccordion}>
                {this.props.values.vendors.map((vendor, index) => (
                  <Accordion.Item eventKey={vendor.id ? vendor.id.toString() : index.toString()} key={vendor.id ? vendor.id : index} data-testid={`accordion-item-${index}`}>
                    <Accordion.Header>
                      Vendor {index + 1}: {vendor.name || "(No Name)"}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group controlId={`vendorName${vendor.id}`}>
                        <Form.Label>Vendor Name</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={vendor.name}
                          onChange={(e) =>
                            this.props.handleVendorChange(index, "name", e.target.value)
                          }
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
                            defaultValue={vendor.dollar}
                            onChange={(e) =>
                              this.props.handleVendorChange(index, "dollar", e.target.value)
                            }
                            required
                          ></Form.Control>
                          <InputGroup.Text>.00</InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                      
                      <Form.Group as={Col}>
                        <Form.Label>Family Name on Bill</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={vendor.family}
                          onChange={(e) =>
                            this.props.handleVendorChange(index, "family", e.target.value)
                          }
                          required
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Label>Account Number on Bill</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={vendor.account}
                          onChange={(e) =>
                            this.props.handleVendorChange(index, "account", e.target.value)
                          }
                          required
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Vendor Mailing Address</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={vendor.address}
                          onChange={(e) =>
                            this.props.handleVendorChange(index, "address", e.target.value)
                          }
                          required
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={vendor.city}
                          onChange={(e) =>
                            this.props.handleVendorChange(index, "city", e.target.value)
                          }
                          required
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Label>State</Form.Label>
                        <Form.Select
                          defaultValue={vendor.state}
                          onChange={(e) =>
                            this.props.handleVendorChange(index, "state", e.target.value)
                          }
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
                          defaultValue={vendor.zip}
                          onChange={(e) =>
                            this.props.handleVendorChange(index, "zip", e.target.value)
                          }
                          required
                        />
                      </Form.Group>

                      &nbsp;
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => this.props.deleteVendor(vendor.id)}  // Pass the vendor ID
                        className="mt-3"
                      >
                        Delete Vendor
                      </Button>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>

              <div className="d-flex justify-content-center mt-3" id="nav-buttons">
                <Button variant="outline-success" onClick={this.props.addVendor} className="mb-3 w-100" id="nav-buttons">
                  Add Vendor
                </Button>
              </div>

              {/* Navigation Buttons */}
              <div id="nav-buttons" className="mt-4">
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
