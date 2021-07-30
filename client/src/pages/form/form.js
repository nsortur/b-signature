import React from "react"
import { Form, Row, Col, Button, Card } from "react-bootstrap";
import '../../App.css';

class FormPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      signingUrl: '', 
      loadingSigning: false,
      otherEthSelected: false,
      childName: '', 
      childDOB: '', 
      childGender: '',
      childEthnicity: '',
      parentName: '',
      parentAddress: '',
      parentCity: '',
      parentState: '',
      parentZip: '',
      parentPhone: '',
      parentCell: '',
      parentEmail: '',
      annualIncome: '',
      requestedGrant: '',
      intendedUse: ''
    };

    this.runSigning = this.runSigning.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    
    // handle option to input other ethnicity
    if (name === 'childEthnicity' && value === 'Other') {
      this.setState({otherEthSelected: true});
    } else if (this.state.otherEthSelected && name === 'childEthnicity'
                && value !== 'Other' && target.className === 'form-select') {
      this.setState({otherEthSelected: false});
    }
    
    this.setState({
      [name]: value
    });
  }
  
  async runSigning (event) {
    event.preventDefault();
    try {
      await this.runLogin();
      fetch('/api/eg001',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          // transmit form info to backend
          childName: this.state.childName, 
          childDOB: this.state.childDOB, 
          childGender: this.state.childGender,
          childEthnicity: this.state.childEthnicity,
          parentName: this.state.parentName,
          parentAddress: this.state.parentAddress,
          parentCity: this.state.parentCity,
          parentState: this.state.parentState,
          parentZip: this.state.parentZip,
          parentPhone: this.state.parentPhone,
          parentCell: this.state.parentCell,
          parentEmail: this.state.parentEmail,
          annualIncome: this.state.annualIncome,
          requestedGrant: this.state.requestedGrant,
          intendedUse: this.state.intendedUse
        }),
        credentials: 'include'
      })
      .then(res => res.json())
      .then(data => {
        this.setState({signingUrl: data.signingUrl}, () => {
          window.location.href = data.signingUrl;
        });
      })
      .catch(error => {
        console.log(error);
        throw new Error('Signing ceremony failed');
      })
    } catch (error) {
      console.log(error);
      return;
    }
  }

  runLogin() {
    const res = fetch('/api/login', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include'
    })
    .catch(err => {
      console.log(err);
      throw new Error('Login failed');
    });
    return res;
  }

  render() {
    // let buttonDisp;
    // if (this.state.loadingSigning) {
    //   buttonDisp = <FontAwesomeIcon icon={faSpinner} spin/>;
    // } else {
    //   buttonDisp = 'Submit';
    // }

    return (
      // <Form onSubmit={this.runSigning} >
      //   <Button variant="primary" type="submit">
      //       Submit
      //   </Button>
      // </Form>
      <Form onSubmit={this.runSigning} className='input-info'>
        <Card >
          <Card.Body>
            <Card.Title>Patient Information</Card.Title>
            
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Child's Name</Form.Label>
                  <Form.Control type="text" placeholder="John Doe" name="childName"
                  value={this.state.childName} onChange={this.handleInputChange} required/>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Date of birth</Form.Label>
                  <Form.Control type="date" name='childDOB' onChange={this.handleInputChange} required></Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Gender</Form.Label>
                  <Form.Control type="text" placeholder="e.g. Male, Female, other" name="childGender"
                  value={this.state.childGender} onChange={this.handleInputChange} required/>
                </Form.Group>
              </Row>
              
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Ethnicity</Form.Label>
                  <Form.Select onChange={this.handleInputChange} name="childEthnicity" required>
                    <option>Choose...</option>
                    <option>African-American</option>
                    <option>Asian/Pacific Islander</option>
                    <option>Caucasian</option>
                    <option>Hispanic</option>
                    <option>Native American</option>
                    <option>Other</option>
                    <option>Prefer not to answer</option>
                  </Form.Select>
                  <Form.Text id="passwordHelpBlock" muted>
                    Information will be used for statistical purposes only and will not affect eligibility.
                  </Form.Text>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>If other, please specify</Form.Label>
                  <Form.Control type="text" name="childEthnicity"
                  value={this.state.childEthnicity} onChange={this.handleInputChange} readOnly={!this.state.otherEthSelected} required/>
                </Form.Group>
              </Row>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <Card.Title>Parent/Legal Guardian Information</Card.Title>
            
              <Form.Group as={Col}>
                <Form.Label>Parent/Legal Guardian Name</Form.Label>
                <Form.Control type="text" placeholder="Adam Smith" name="parentName"
                value={this.state.parentName} onChange={this.handleInputChange} required/>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="1234 Main St" name="parentAddress" value={this.state.parentAddress} onChange={this.handleInputChange} required/>
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" placeholder="Cleveland" name="parentCity" value={this.state.parentCity} onChange={this.handleInputChange} required/>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>State</Form.Label>
                <Form.Select defaultValue="Choose..." onChange={this.handleInputChange} name="parentState" required>
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
                <Form.Control name="parentZip" value={this.state.parentZip} onChange={this.handleInputChange} required/>
              </Form.Group>
                
            </Row>

            <Row>
              <Form.Group as={Col} >
                <Form.Label>Phone</Form.Label>
                <Form.Control type="number" name="parentPhone" placeholder="Enter phone #" value={this.state.parentPhone} onChange={this.handleInputChange} required/>
              </Form.Group>

              <Form.Group as={Col} >
                <Form.Label>Cell phone</Form.Label>
                <Form.Control type="number" name="parentCell" placeholder="Enter cell phone #" value={this.state.parentCell} onChange={this.handleInputChange} required/>
              </Form.Group>

            </Row>
            <Form.Group as={Col} >
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="parentEmail" value={this.state.parentEmail} onChange={this.handleInputChange} required/>
            </Form.Group>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Card.Title>Income Information</Card.Title>
            
            <Form.Group as={Col}>
              <Form.Label>Annual Income ($)</Form.Label>
              <Form.Control type="number" step="1000" min="0" name="annualIncome" value={this.state.annualIncome} onChange={this.handleInputChange} required>
              </Form.Control>
              <Form.Text>i.e. government assistance, child support, alimony, family assistance, <u>all sources of income to pay living expenses</u></Form.Text>
            </Form.Group>
            
            <Form.Group as={Col}>
              <Form.Label>Request Grant Amount ($)</Form.Label>
              <Form.Control type="number" step="500" min="0" name="requestedGrant" value={this.state.requestedGrant} onChange={this.handleInputChange} required>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Intended Use of Grant</Form.Label>
              <Form.Control as="textarea" rows={3} type="text" name="intendedUse" value={this.state.intendedUse} onChange={this.handleInputChange} required/>
              <Form.Text>if applicable, please provide bills <u>paid directly to the vendor</u> with the vendor name, account number, mailing address, family's last name, and dollar amount owed.</Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>

        <Button variant="primary" type="submit">
            Confirm Information and Sign
        </Button>
      </Form>
    )
  }
};

export default FormPage;
