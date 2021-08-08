import React from 'react';
import {Form,Card, Row, Col, Button} from 'react-bootstrap';

// page 1/3
class ParentInformation extends React.Component {

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
            <Card.Title >Parent/Legal Guardian Information (1/3)</Card.Title>
            <Form>
              <Form.Group as={Col}>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Adam Smith" name="parentName"
                defaultValue={this.props.values.parentName} onChange={this.props.handleChange} required/>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="1234 Main Street" name="parentAddress" defaultValue={this.props.values.parentAddress} onChange={this.props.handleChange} required/>
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" placeholder="Cleveland" name="parentCity" defaultValue={this.props.values.parentCity} onChange={this.props.handleChange} required/>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>State</Form.Label>
                <Form.Select defaultValue="Choose..." onChange={this.props.handleChange} name="parentState" required>
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
                <Form.Control name="parentZip" defaultValue={this.props.values.parentZip} onChange={this.props.handleChange} placeholder="44101" required/>
              </Form.Group>
                
            </Row>

            <Row>
              <Form.Group as={Col} >
                <Form.Label>Phone</Form.Label>
                <Form.Control name="parentPhone" placeholder="(555) 555-1212" defaultValue={this.props.values.parentPhone} onChange={this.props.handleChange} required/>
              </Form.Group>

              <Form.Group as={Col} >
                <Form.Label>Cell phone</Form.Label>
                <Form.Control name="parentCell" placeholder="(555) 123-4545" defaultValue={this.props.values.parentCell} onChange={this.props.handleChange} required/>
              </Form.Group>

            </Row>
            <Form.Group as={Col} >
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" name="parentEmail" defaultValue={this.props.values.parentEmail} onChange={this.props.handleChange} required/>
            </Form.Group>
            <Button variant="success" onClick={this.continue} className='form-button'>Next Page</Button>
          </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col></Col>
    </Row>
    )
  }
}

export default ParentInformation;