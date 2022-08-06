import React from "react";
import ParentInformation from "../../components/familyFormComponents/parentInfo";
import ChildInformation from "../../components/familyFormComponents/childInfo";
import IncomeInformation from "../../components/familyFormComponents/incomeInfo";
import SocWorkInformation from "../../components/familyFormComponents/socWorkInfo";
import { navigate } from "@reach/router";
import CryptoJS from "crypto-js";

class FamilyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      signingUrl: "",
      loadingSigning: false,
      otherEthSelected: false,
      showFillAlert: false,
      childName: "",
      childDOB: "",
      childGender: "",
      childEthnicity: "",
      parentName: "",
      parentAddress: "",
      parentCity: "",
      parentState: "",
      parentZip: "",
      parentPhone: "",
      parentCell: "",
      parentEmail: "",
      annualIncome: "",
      requestedGrant: "",
      socWorkName: "",
      socWorkEmail: "",
      socialWorkerEmailConfirm: "",
      intendedUse: "",
      fieldsNeedFilling: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.runSigning = this.runSigning.bind(this);
    this.dismissFillAlert = this.dismissFillAlert.bind(this);
    this.salt = process.env.SALT || "development-salt-98sdi3u-o82bfip";
  }

  encryptData(data) {
    // encryption for local storage
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.salt).toString();
  }

  decryptData(cipherText) {
    // decryption for local storage
    const bytes = CryptoJS.AES.decrypt(cipherText, this.salt);
    try {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (err) {
      return null;
    }
  }

  emptyState() {
    // empties state
    this.setState({
      step: 1,
      signingUrl: "",
      loadingSigning: false,
      otherEthSelected: false,
      showFillAlert: false,
      childName: "",
      childDOB: "",
      childGender: "",
      childEthnicity: "",
      parentName: "",
      parentAddress: "",
      parentCity: "",
      parentState: "",
      parentZip: "",
      parentPhone: "",
      parentCell: "",
      parentEmail: "",
      annualIncome: "",
      requestedGrant: "",
      socWorkName: "",
      socWorkEmail: "",
      socialWorkerEmailConfirm: "",
      intendedUse: "",
      fieldsNeedFilling: [],
    });
  }

  componentDidMount() {
    // local storage data in case user accidentally hits back or forward
    const localData = localStorage.getItem("user");

    if (localData) {
      // if data exists
      const originalData = this.decryptData(localData);

      if (!originalData) {
        // data has been changed
        this.emptyState();
      } else {
        this.formData = originalData;
        this.setState({
          step: 1,
          signingUrl: this.formData.signingUrl,
          loadingSigning: false,
          otherEthSelected: false,
          showFillAlert: false,
          childName: this.formData.childName,
          childDOB: this.formData.childDOB,
          childGender: this.formData.childGender,
          childEthnicity: this.formData.childEthnicity,
          parentName: this.formData.parentName,
          parentAddress: this.formData.parentAddress,
          parentCity: this.formData.parentCity,
          parentState: this.formData.parentState,
          parentZip: this.formData.parentZip,
          parentPhone: this.formData.parentPhone,
          parentCell: this.formData.parentCell,
          parentEmail: this.formData.parentEmail,
          annualIncome: this.formData.annualIncome,
          requestedGrant: this.formData.requestedGrant,
          socWorkName: this.formData.socWorkName,
          socWorkEmail: this.formData.socWorkEmail,
          socialWorkerEmailConfirm: this.formData.socialWorkerEmailConfirm,
          intendedUse: this.formData.intendedUse,
          fieldsNeedFilling: this.formData.fieldsNeedFilling,
        });
      }
    } else {
      this.emptyState();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem("user", this.encryptData(nextState));
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
      "Social worker name": this.state.socWorkName,
      "Social worker email": this.state.socWorkEmail,
      "Social worker email confirmation": this.state.socialWorkerEmailConfirm,
    };
    const inputNotFilled = [];
    for (const [key, value] of Object.entries(inputVals)) {
      if (value === "") {
        inputNotFilled.push(key);
      }
    }
    // validate family email
    if (
      !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(this.state.parentEmail)
    ) {
      inputNotFilled.push("Parent's email");
    }
    // validate social worker email
    if (
      !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(this.state.socWorkEmail)
    ) {
      inputNotFilled.push("Social worker's email");
    }
    if (this.state.socWorkEmail !== this.state.socialWorkerEmailConfirm) {
      inputNotFilled.push("Please confirm emails match");
    }

    // validate all fields are filled
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
          socialWorkerName: this.state.socWorkName,
          socialWorkerEmail: this.state.socWorkEmail,
        }),
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Signing input is not accepted");
          }
        })
        .then((data) => {
          this.setState(
            {
              signingUrl: data.signingUrl,
              step: 4,
              loadingSigning: true,
              otherEthSelected: false,
              showFillAlert: false,
              childName: "",
              childDOB: "",
              childGender: "",
              childEthnicity: "",
              parentName: "",
              parentAddress: "",
              parentCity: "",
              parentState: "",
              parentZip: "",
              parentPhone: "",
              parentCell: "",
              parentEmail: "",
              annualIncome: "",
              requestedGrant: "",
              socWorkName: "",
              socWorkEmail: "",
              socialWorkerEmailConfirm: "",
              intendedUse: "",
              fieldsNeedFilling: [],
            },
            () => {
              // clear local storage for security
              localStorage.clear();
              window.location.href = data.signingUrl;
            }
          );
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
    if (step < 4) {
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
            nextPage={this.nextPage}
            values={this.state}
          />
        );
        break;
      case 4:
        curForm = (
          <SocWorkInformation
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
        <div className="left-stuff">{curForm}</div>
      </div>
    );
  }
}

export default FamilyForm;
