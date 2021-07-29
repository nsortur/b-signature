import React from "react"
import { Form, Row, Col, Button, Card } from "react-bootstrap";

import '../../App.css';

class ContentPage extends React.Component {

  render() {
    return (
      <Card className='input-info'>
        <Card.Body>
          <Card.Title>Patient Information</Card.Title>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Child's Name</Form.Label>
                <Form.Control type="email" placeholder="John Doe" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Date of birth</Form.Label>
                
              </Form.Group>
            </Row>

            {/* <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control placeholder="1234 Main St" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridAddress2">
              <Form.Label>Address 2</Form.Label>
              <Form.Control placeholder="Apartment, studio, or floor" />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State</Form.Label>
                <Form.Control />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Zip</Form.Label>
                <Form.Control />
              </Form.Group>
            </Row> */}

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
//  
      //  <header className="App-header">
      //    <img src={logo} className="App-logo" alt="logo" />
      //    <p> Reached content page! </p>
      //  </header>
    )
  }
};

export default ContentPage;