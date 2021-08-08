import React from 'react';
import {Row, Col, Card, Form, Button} from 'react-bootstrap';

// page 2/3
class ChildMedicalInfo extends React.Component {

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

  // TODO change to submit form
  render() {
    return (
      <Row>
        <Col></Col>
        <Col xs={8}>
          <Card className="input-card">
            <Card.Body>
            <Card.Title>Child/Patient Information (2/3)</Card.Title>
            <Form>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Child's Name</Form.Label>
                  <Form.Control type="text" placeholder="John Doe" name="childName"
                  defaultValue={this.props.values.childName} onChange={this.props.handleChange} required/>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Child's Physician</Form.Label>
                  <Form.Control type="text" placeholder="Dr. Adam Smith" name="childPhysician"
                  defaultValue={this.props.values.childPhysician} onChange={this.props.handleChange} required/>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Child's Diagnosis</Form.Label>
                  <Form.Control type="text" placeholder="e.g. Leukemia, Lymphoma, other" name="childDiagnosis"
                  defaultValue={this.props.values.childDiagnosis} onChange={this.props.handleChange} required/>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Date of Diagnosis</Form.Label>
                  <Form.Control type="date" name='diagnosisDate' onChange={this.props.handleChange} required></Form.Control>
                </Form.Group>
              </Row>
              
              <Form.Group>
                <Form.Label>Medical Condition Details</Form.Label>
                <Form.Control as="textarea" rows={3} type="text" name="notableFacts" defaultValue={this.props.values.notableFacts} onChange={this.props.handleChange} required/>
                <Form.Text>Please describe the child's medical condition, anticipated hospital stay, and any other notable facts.</Form.Text>
              </Form.Group>

              <Button variant="secondary" onClick={this.back} className='form-button'>Previous Page</Button>
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

export default ChildMedicalInfo;