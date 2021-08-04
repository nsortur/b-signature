import React from "react";
import ParentInformation from "../../components/forms/parentInfo";
import ChildInformation from "../../components/forms/childInfo";
import IncomeInformation from "../../components/forms/incomeInfo";

class MultiForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 1, 
      signingUrl: '', 
      loadingSigning: false,
      otherEthSelected: false,
      showFillAlert: false,
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
      intendedUse: '',
      fieldsNeedFilling: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.runSigning = this.runSigning.bind(this);
    this.dismissFillAlert = this.dismissFillAlert.bind(this);
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
    // get information about unfilled fields to user, if necessary
    const inputVals = {
      'Child\'s name': this.state.childName,
      'Child\'s DOB': this.state.childDOB,
      'Child\'s gender': this.state.childGender,
      'Child\'s ethnicity': this.state.childEthnicity,
      'Parent\'s name': this.state.parentName,
      'Parent\'s address': this.state.parentAddress,
      'Parent\'s city': this.state.parentCity,
      'Parent\'s state': this.state.parentState,
      'Parent\'s zipcode': this.state.parentZip,
      'Parent\'s phone': this.state.parentPhone,
      'Parent\'s cell': this.state.parentCell,
      'Parent\'s email': this.state.parentEmail,
      'Annual income': this.state.annualIncome,
      'Requested grant': this.state.requestedGrant,
      'Intended use of grant': this.state.intendedUse
    };
    const inputNotFilled = [];
    for (const [key, value] of Object.entries(inputVals)) {
      if (value === '') {
        inputNotFilled.push(key);
      }
    }
    if (inputNotFilled.length !== 0) {
      this.setState({showFillAlert: true, fieldsNeedFilling: inputNotFilled});
      return;
    }

    // start login and get signing URL
    this.setState({loadingSigning: true, showFillAlert: false});
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

  nextPage() {
    const step = this.state.step;
    if (step < 3) {
      this.setState({step: step + 1});
    }
  }

  prevPage() {
    const step = this.state.step;
    if (step > 1) {
      this.setState({step : step - 1});
    }
  }

  dismissFillAlert() {
    this.setState({showFillAlert: false});
  }
  
  render() {
    let curForm;
    switch (this.state.step) {
      case 1:
        curForm = <ParentInformation
                handleChange = {this.handleInputChange}
                nextPage = {this.nextPage}
                values = {this.state}/>
        break;
      case 2:
        curForm = <ChildInformation
                handleChange = {this.handleInputChange}
                nextPage = {this.nextPage}
                prevPage = {this.prevPage}
                values = {this.state}/>
        break;
      case 3:
        curForm = <IncomeInformation
                handleChange = {this.handleInputChange}
                prevPage = {this.prevPage}
                submitForm = {this.runSigning}
                dismissFillAlert = {this.dismissFillAlert}
                values = {this.state}
                />
        break;
      default:
        curForm = <h1>Impossible! :o</h1>
    }
    return (
      <div className='input-page'>
        <div id='form-header'>Apply For Aid</div>
        {curForm}
      </div>
    )
  }
}

export default MultiForm;