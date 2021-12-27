import React from "react";
import ParentInformation from "../../components/familyFormComponents/parentInfo";
import ChildInformation from "../../components/familyFormComponents/childInfo";
import IncomeInformation from "../../components/familyFormComponents/incomeInfo";
import { navigate } from "@reach/router";

class FamilyForm extends React.Component {
  constructor(props) {
    super(props);
    // demo: initalizing state to pre-filled values
    this.state = {
      step: 1,
      signingUrl: "",
      loadingSigning: false,
      otherEthSelected: false,
      showFillAlert: false,
      childName: "Example Name",
      childDOB: "02/14/2006",
      childGender: "Female",
      childEthnicity: "Hispanic",
      parentName: "John Doe",
      parentAddress: "101 Rockland Cir.",
      parentCity: "Wilmington",
      parentState: "Delaware",
      parentZip: "19803",
      parentPhone: "(302) 555-5555",
      parentCell: "(302) 231-1234",
      parentEmail: "example@domain.com",
      annualIncome: "200000",
      requestedGrant: "200000",
      intendedUse:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras et massa sed dui mollis maximus. Sed mauris lorem, lobortis nec quam a.",
      fieldsNeedFilling: [],
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
    const value = target.type === "checkbox" ? target.checked : target.value;
    // handle option to input other ethnicity
    if (name === "childEthnicity" && value === "Other") {
      this.setState({ otherEthSelected: true });
    } else if (
      this.state.otherEthSelected &&
      name === "childEthnicity" &&
      value !== "Other" &&
      target.className === "form-select"
    ) {
      this.setState({ otherEthSelected: false });
    }

    this.setState({
      [name]: value,
    });
  }

  async runSigning(event) {
    // get information about unfilled fields to user, if necessary
    const inputVals = {
      "Child's name": this.state.childName,
      "Child's DOB": this.state.childDOB,
      "Child's gender": this.state.childGender,
      "Child's ethnicity": this.state.childEthnicity,
      "Parent's name": this.state.parentName,
      "Parent's address": this.state.parentAddress,
      "Parent's city": this.state.parentCity,
      "Parent's state": this.state.parentState,
      "Parent's zipcode": this.state.parentZip,
      "Parent's phone": this.state.parentPhone,
      "Parent's cell": this.state.parentCell,
      "Parent's email": this.state.parentEmail,
      "Annual income": this.state.annualIncome,
      "Requested grant": this.state.requestedGrant,
      "Intended use of grant": this.state.intendedUse,
    };
    const inputNotFilled = [];
    for (const [key, value] of Object.entries(inputVals)) {
      if (value === "") {
        inputNotFilled.push(key);
      }
    }
    // validate email
    if (
      !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(this.state.parentEmail)
    ) {
      inputNotFilled.push("Parent's email");
    }

    if (inputNotFilled.length !== 0) {
      this.setState({ showFillAlert: true, fieldsNeedFilling: inputNotFilled });
      return;
    }

    // start login and get signing URL
    this.setState({ loadingSigning: true, showFillAlert: false });
    try {
      await this.runLogin();
      fetch("/api/eg001/family", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
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
          intendedUse: this.state.intendedUse,
        }),
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Signing input not accepted");
          }
        })
        .then((data) => {
          this.setState({ signingUrl: data.signingUrl }, () => {
            window.location.href = data.signingUrl;
          });
        })
        .catch((error) => {
          console.log(error);
          navigate("/bad/");
        });
    } catch (error) {
      console.log(error);
      navigate("/bad");
    }
  }

  runLogin() {
    const res = fetch("/api/login", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    }).catch((err) => {
      console.log(err);
      throw new Error("Login failed");
    });
    return res;
  }

  nextPage() {
    const step = this.state.step;
    if (step < 3) {
      this.setState({ step: step + 1 });
    }
  }

  prevPage() {
    const step = this.state.step;
    if (step > 1) {
      this.setState({ step: step - 1 });
    }
  }

  dismissFillAlert() {
    this.setState({ showFillAlert: false });
  }

  render() {
    let curForm;
    switch (this.state.step) {
      case 1:
        curForm = (
          <ParentInformation
            handleChange={this.handleInputChange}
            nextPage={this.nextPage}
            values={this.state}
          />
        );
        break;
      case 2:
        curForm = (
          <ChildInformation
            handleChange={this.handleInputChange}
            nextPage={this.nextPage}
            prevPage={this.prevPage}
            values={this.state}
          />
        );
        break;
      case 3:
        curForm = (
          <IncomeInformation
            handleChange={this.handleInputChange}
            prevPage={this.prevPage}
            submitForm={this.runSigning}
            dismissFillAlert={this.dismissFillAlert}
            values={this.state}
          />
        );
        break;
      default:
        curForm = <h1>Impossible! :o</h1>;
    }
    return (
      <div className="input-page">
        <div id="form-header">Apply For Aid</div>
        {curForm}
        {/* demo: the following information */}
        <p>
          This application is in demonstration mode, <u>do not</u> enter
          personal information
        </p>
      </div>
    );
  }
}

export default FamilyForm;
