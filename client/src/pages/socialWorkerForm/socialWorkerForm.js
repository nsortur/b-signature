import React from "react";
import ChildMedicalInfo from "../../components/medicalFormComponents/childMedicalInfo";
import SocialWorkerInfo from "../../components/medicalFormComponents/socialWorkerInfo";
import HospitalInfo from "../../components/medicalFormComponents/hospitalInfo";
import { navigate } from "@reach/router";

// PAGE NO LONGER USED IN NEW WORKFLOW
class SocialWorkerForm extends React.Component {
  constructor(props) {
    super(props);
    // demo: initalizing state to pre-filled values
    this.state = {
      step: 1,
      signingUrl: "",
      loadingSigning: false,
      showFillAlert: false,
      childName: "Example Name",
      childDOB: "2005-01-02",
      childDiagnosis: "Leukemia",
      diagnosisDate: "2008-02-03",
      childPhysician: "Dr. Albert Einstein",
      hospital: "AI Dupont Hospital for Children",
      hospitalAddress: "1600 Rockland Road",
      hospitalCity: "Wilmington",
      hospitalState: "",
      hospitalZip: "19803",
      socialWorkerPhone: "(302) 555-5555, ext. 2525",
      notableFacts:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras et massa sed dui mollis maximus. Sed mauris lorem, lobortis nec quam a, venenatis suscipit ligula. In hac habitasse platea dictumst. Maecenas et ornare purus. Praesent pharetra ipsum vitae purus fermentum, in gravida ex pretium. Cras malesuada orci sit amet tincidunt aliquam. Etiam feugiat augue sed eros tincidunt, ac faucibus massa sodales. Cras fringilla, eros vitae venenatis consequat, justo nibh dictum est, id auctor sem purus suscipit sem. In malesuada at nibh sit amet aliquam. Maecenas non eros eget sapien facilisis efficitur nec tempus neque. Integer quis tellus in felis tristique imperdiet non ac turpis. Vivamus ultrices tincidunt sodales. Etiam eros lacus, dignissim nec massa in, sodales mattis dolor.",
      socialWorkerName: "John Doe",
      socialWorkerEmail: "socialworker@socialwork.com",
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
    this.setState({
      [target.name]: target.value,
    });
  }

  async runSigning(event) {
    // get information about unfilled fields to user, if necessary
    const inputVals = {
      "Child's name": this.state.childName,
      "Child's DOB": this.state.childDOB,
      "Child's Diagnosis": this.state.childDiagnosis,
      "Date of Diagnosis": this.state.diagnosisDate,
      "Child's Physician": this.state.childPhysician,
      Hospital: this.state.hospital,
      "Hospital's Address": this.state.hospitalAddress,
      "Hospital's City": this.state.hospitalCity,
      "Hospital's state": this.state.hospitalState,
      "Hospital's zipcode": this.state.hospitalZip,
      "Social Worker's phone": this.state.socialWorkerPhone,
      "Notable facts": this.state.notableFacts,
      "Social Worker Name": this.state.socialWorkerName,
      "Social Worker Email": this.state.socialWorkerEmail,
    };
    const inputNotFilled = [];
    for (const [key, value] of Object.entries(inputVals)) {
      if (value === "") {
        inputNotFilled.push(key);
      }
    }
    // validate email
    if (
      !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(
        this.state.socialWorkerEmail
      )
    ) {
      inputNotFilled.push("Social Worker Email");
    }

    if (inputNotFilled.length !== 0) {
      this.setState({ showFillAlert: true, fieldsNeedFilling: inputNotFilled });
      return;
    }

    // start login and get signing URL
    this.setState({ loadingSigning: true, showFillAlert: false });
    try {
      await this.runLogin();
      fetch("/api/eg001/socialworker", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          // transmit form info to backend
          childName: this.state.childName,
          childDOB: this.state.childDOB,
          childDiagnosis: this.state.childDiagnosis,
          diagnosisDate: this.state.diagnosisDate,
          childPhysician: this.state.childPhysician,
          hospital: this.state.hospital,
          hospitalAddress: this.state.hospitalAddress,
          hospitalCity: this.state.hospitalCity,
          hospitalState: this.state.hospitalState,
          hospitalZip: this.state.hospitalZip,
          socialWorkerPhone: this.state.socialWorkerPhone,
          notableFacts: this.state.notableFacts,
          socialWorkerName: this.state.socialWorkerName,
          socialWorkerEmail: this.state.socialWorkerEmail,
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
      navigate("/bad/");
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
          <SocialWorkerInfo
            handleChange={this.handleInputChange}
            nextPage={this.nextPage}
            values={this.state}
          />
        );
        break;
      case 2:
        curForm = (
          <ChildMedicalInfo
            handleChange={this.handleInputChange}
            nextPage={this.nextPage}
            prevPage={this.prevPage}
            values={this.state}
          />
        );
        break;
      case 3:
        curForm = (
          <HospitalInfo
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
        <div id="form-header">Provide Medical Information</div>
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

export default SocialWorkerForm;
