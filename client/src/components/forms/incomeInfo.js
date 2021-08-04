import React from 'react';
import {Row, Col, Card, Form, Button, Spinner, Alert, ListGroup, InputGroup} from 'react-bootstrap';

// TODO disabled when loading
class IncomeInformation extends React.Component {

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
          <Alert.Heading>Please fill out the following fields:</Alert.Heading>
          <ListGroup variant="flush">
            {this.props.values.fieldsNeedFilling.map((field) => 
              <ListGroup.Item variant="danger">{field}</ListGroup.Item>
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
            <Card.Title>Income Information (3/3)</Card.Title>
            <Form>
              <Form.Group as={Col}>
                <Form.Label>Annual Income ($)</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control type="number" step="500" min="0" name="annualIncome" defaultValue={this.props.values.annualIncome} onChange={this.props.handleChange} required>
                  </Form.Control>
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
                <Form.Text>i.e. government assistance, child support, alimony, family assistance, <u>all sources of income to pay living expenses</u></Form.Text>
              </Form.Group>
              
              <Form.Group as={Col}>
                <Form.Label>Request Grant Amount ($)</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control type="number" step="500" min="0" name="requestedGrant" defaultValue={this.props.values.requestedGrant} onChange={this.props.handleChange} required>
                  </Form.Control>
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
                
              </Form.Group>

              <Form.Group>
                <Form.Label>Intended Use of Grant</Form.Label>
                <Form.Control as="textarea" rows={3} type="text" name="intendedUse" defaultValue={this.props.values.intendedUse} onChange={this.props.handleChange} required/>
                <Form.Text>if applicable, please provide bills <u>paid directly to the vendor</u> with the vendor name, account number, mailing address, family's last name, and dollar amount owed.</Form.Text>
              </Form.Group>
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

export default IncomeInformation;