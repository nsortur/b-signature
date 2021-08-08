import React from 'react';
import {Row, Col, Card, Form, Button, Spinner, Alert, ListGroup} from 'react-bootstrap';

// TODO disabled when loading
// page 3/3
class HospitalInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {showFillAlert: false}
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
    let backDisp = <Button variant="secondary" onClick={this.back} 
    className='form-button'>Previous Page</Button>
    if (this.props.values.loadingSigning) {
      buttonDisp = (<Spinner animation="border" role="status" variant="light">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>);
      backDisp = null;
    } else {
      buttonDisp = 'Review and eSign';
    }

    let fillAlert;
    if (this.props.values.showFillAlert) {
      fillAlert = (
        <Alert variant="danger" onClose={this.props.dismissFillAlert} dismissible>
          <Alert.Heading>Please fill out or fix the following fields:</Alert.Heading>
          <ListGroup variant="flush">
            {this.props.values.fieldsNeedFilling.map((field, idx) => 
              <ListGroup.Item variant="danger" key={idx}>{field}</ListGroup.Item>
            )}
          </ListGroup>
      </Alert>
      )
    }
    
    return (
      <Row>
        <Col></Col>
        <Col xs={8}>
          <Card className="input-card">
            <Card.Body>
            <Card.Title>Hospital Information (3/3)</Card.Title>
            <Form>

              <Form.Group as={Col}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="A.I. duPont Hospital for Children" name="hospital" defaultValue={this.props.values.hospital} onChange={this.props.handleChange} required/>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="1234 Main Street" name="hospitalAddress" defaultValue={this.props.values.hospitalAddress} onChange={this.props.handleChange} required/>
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" placeholder="Cleveland" name="hospitalCity" defaultValue={this.props.values.hospitalCity} onChange={this.props.handleChange} required/>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>State</Form.Label>
                  <Form.Select defaultValue="Choose..." onChange={this.props.handleChange} name="hospitalState" required>
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
                  <Form.Control name="hospitalZip" defaultValue={this.props.values.hospitalZip} onChange={this.props.handleChange} placeholder="44101" required/>
                </Form.Group>
                  
              </Row>

              {backDisp}
              <Button variant="success" onClick={this.submit} className='form-button' type="submit">
                {buttonDisp}
              </Button>
            </Form>
            </Card.Body>
          </Card>
          {fillAlert}
        </Col>
        <Col></Col>
      </Row>
    )
  }
}

export default HospitalInfo;