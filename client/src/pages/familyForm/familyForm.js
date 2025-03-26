import React from "react";
import ParentInformation from "../../components/familyFormComponents/parentInfo";
import ChildInformation from "../../components/familyFormComponents/childInfo";
import IncomeInformation from "../../components/familyFormComponents/incomeInfo";
import SocWorkInformation from "../../components/familyFormComponents/socWorkInfo";
import { navigate } from "@reach/router";
import CryptoJS from "crypto-js";
import { Alert, Col, ListGroup, Row } from "react-bootstrap";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";

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
      childAge: "",
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
      // billVendor: "",
      // billDollar: "",
      // billFamily: "",
      // billAccount: "",
      // vendorAddress: "",
      // vendorCity: "",
      // vendorState: "",
      // vendorZip: "",
      fieldsNeedFilling: [],
      vendors: [],
      activeKey: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.runSigning = this.runSigning.bind(this);
    this.dismissFillAlert = this.dismissFillAlert.bind(this);
    this.addVendor = this.addVendor.bind(this);
    this.deleteVendor = this.deleteVendor.bind(this);
    this.handleVendorChange = this.handleVendorChange.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.salt = process.env.BSIG_SALT || "development-salt-98sdi3u-o82bfip";
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
      childAge: "",
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
      // billVendor: "",
      // billDollar: "",
      // billFamily: "",
      // billAccount: "",
      // vendorAddress: "",
      // vendorCity: "",
      // vendorState: "",
      // vendorZip: "",
      fieldsNeedFilling: [],
      vendors: [],
      activeKey: null,
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
          childAge: this.formData.childAge,
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
          // billVendor: this.formData.billVendor,
          // billDollar: this.formData.billDollar,
          // billFamily: this.formData.billFamily,
          // billAccount: this.formData.billAccount,
          // vendorAddress: this.formData.vendorAddress,
          // vendorCity: this.formData.vendorCity,
          // vendorState: this.formData.vendorState,
          // vendorZip: this.formData.vendorZip,
          fieldsNeedFilling: this.formData.fieldsNeedFilling,
          vendors: this.formData.vendors || [],
          activeKey: this.formData.activeKey,
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
    // Done: remove input vals a bunch of non-empty testing values, this is just for testing
    // this.setState({
    //   parentName: "Steve",
    //   parentAddress: "1234 Main St",
    //   parentCity: "San Francisco",
    //   parentState: "CA",
    //   parentZip: "94105",
    //   parentPhone: "123-456-7890",
    //   parentCell: "123-456-7890",
    //   parentEmail: "someemail@gmail.com",
    //   childName: "Billy",
    //   childAge: "5",
    //   childGender: "Male",
    //   childEthnicity: "Another",
    //   annualIncome: "50000",
    //   requestedGrant: "1000",
    //   socWorkName: "Jane",
    //   socWorkEmail: "janedoasdasdasd@gmail.com",
    //   socialWorkerEmailConfirm: "janedoasdasdasd@gmail.com",
    //   vendors: [
    //     {
    //       id: 1,
    //       name: "Vendor 1 with a really long name",
    //       dollar: 1000,
    //       family: "Smith Smith Smith Smith",
    //       account: "123ABC",
    //       address: "456 Elm Saint Augustine Very Very Long Address St",
    //       city: "Los Angeles",
    //       state: "CA",
    //       zip: "90001",
    //     },
    //     {
    //       id: 2,
    //       name: "Vendor 2",
    //       dollar: 2000,
    //       family: "Johnson",
    //       account: "456DEF",
    //       address: "789 Maple Ave",
    //       city: "Seattle",
    //       state: "WA",
    //       zip: "98101",
    //     },
    //     {
    //       id: 3,
    //       name: "Vendor 3",
    //       dollar: 3000,
    //       family: "Williams",
    //       account: "789GHI",
    //       address: "101 Pine St",
    //       city: "Portland",
    //       state: "OR",
    //       zip: "97201",
    //     },
    //     {
    //       id: 4,
    //       name: "Vendor 4",
    //       dollar: 4000,
    //       family: "Brown",
    //       account: "012JKL",
    //       address: "202 Oak St",
    //       city: "Denver",
    //       state: "CO",
    //       zip: "80201",
    //     },
    //     {
    //       id: 5,
    //       name: "Vendor 5",
    //       dollar: 5000,
    //       family: "Davis",
    //       account: "345MNO",
    //       address: "303 Birch St",
    //       city: "Austin",
    //       state: "TX",
    //       zip: "73301",
    //     },
    //     {
    //       id: 6,
    //       name: "Vendor 6",
    //       dollar: 6000,
    //       family: "Miller",
    //       account: "678PQR",
    //       address: "404 Cedar St",
    //       city: "Boston",
    //       state: "MA",
    //       zip: "02101",
    //     },
    //     {
    //       id: 7,
    //       name: "Vendor 7",
    //       dollar: 7000,
    //       family: "Wilson",
    //       account: "901STU",
    //       address: "505 Spruce St",
    //       city: "Chicago",
    //       state: "IL",
    //       zip: "60601",
    //     },
    //     {
    //       id: 8,
    //       name: "Vendor 8",
    //       dollar: 8000,
    //       family: "Moore",
    //       account: "234VWX",
    //       address: "606 Maple St",
    //       city: "Miami",
    //       state: "FL",
    //       zip: "33101",
    //     }
    //   ],
    // });
    // END REMOVE


    // get information about unfilled fields to user, if necessary
    const inputVals = {
      "Parent's name": this.state.parentName,
      "Parent's address": this.state.parentAddress,
      "Parent's city": this.state.parentCity,
      "Parent's state": this.state.parentState,
      "Parent's zipcode": this.state.parentZip,
      "Parent's phone": this.state.parentPhone,
      "Parent's cell": this.state.parentCell,
      "Parent's email": this.state.parentEmail,
      "Child's name": this.state.childName,
      "Child's Age": this.state.childAge,
      "Child's gender": this.state.childGender,
      "Child's ethnicity": this.state.childEthnicity,
      "Annual income": this.state.annualIncome,
      "Requested grant": this.state.requestedGrant,
      "Social worker name": this.state.socWorkName,
      "Social worker email": this.state.socWorkEmail,
      "Social worker email confirmation": this.state.socialWorkerEmailConfirm,
    };
    // page each value is on, for guiding user back to potential unfilled fields
    const valPages = {
      "Parent's name": 1,
      "Parent's address": 1,
      "Parent's city": 1,
      "Parent's state": 1,
      "Parent's zipcode": 1,
      "Parent's phone": 1,
      "Parent's cell": 1,
      "Parent's email": 1,
      "Parent's email must be valid email address": 1,
      "Child's name": 2,
      "Child's Age": 2,
      "Child's gender": 2,
      "Child's ethnicity": 2,
      "Annual income": 3,
      "Requested grant": 3,
      "At least one vendor is required": 3,
      "No more than 8 vendors are allowed": 3,
      "Social worker name": 4,
      "Social worker email": 4,
      "Social worker's email must be valid email address": 4,
      "Please confirm emails match": 4,
      "Social worker email confirmation": 4,
    };

    // Add vendor field mappings dynamically
    for (let i = 1; i <= 8; i++) {
      valPages[`Vendor ${i} name is required`] = 3;
      valPages[`Vendor ${i} dollar amount is required`] = 3;
      valPages[`Vendor ${i} family name is required`] = 3;
      valPages[`Vendor ${i} account number is required`] = 3;
      valPages[`Vendor ${i} address is required`] = 3;
      valPages[`Vendor ${i} city is required`] = 3;
      valPages[`Vendor ${i} state is required`] = 3;
      valPages[`Vendor ${i} zip is required`] = 3;
    }
    const inputNotFilled = [];
    for (const [key, value] of Object.entries(inputVals)) {
      if (value === "") {
        inputNotFilled.push(key);
      }
    }
  
    // Validate family email
    if (!/\S+@\S+\.\S+/.test(this.state.parentEmail)) {
      inputNotFilled.push("Parent's email must be valid email address");
    }
  
    // Validate social worker email
    if (!/\S+@\S+\.\S+/.test(this.state.socWorkEmail)) {
      inputNotFilled.push("Social worker's email must be valid email address");
    }
  
    if (this.state.socWorkEmail !== this.state.socialWorkerEmailConfirm) {
      inputNotFilled.push("Please confirm emails match");
    }
    
    if (this.state.vendors.length === 0) {
      inputNotFilled.push("At least one vendor is required");
    } else if (this.state.vendors.length > 8) {
      inputNotFilled.push("No more than 8 vendors are allowed");
    } else {
      this.state.vendors.forEach((vendor, index) => {
      const vendorFields = {
        [`Vendor ${index + 1} name`]: vendor.name,
        [`Vendor ${index + 1} dollar amount`]: vendor.dollar,
        [`Vendor ${index + 1} family name`]: vendor.family,
        [`Vendor ${index + 1} account number`]: vendor.account,
        [`Vendor ${index + 1} address`]: vendor.address,
        [`Vendor ${index + 1} city`]: vendor.city,
        [`Vendor ${index + 1} state`]: vendor.state,
        [`Vendor ${index + 1} zip`]: vendor.zip,
      };
      for (const [fieldName, fieldValue] of Object.entries(vendorFields)) {
        if (!fieldValue) {
        inputNotFilled.push(`${fieldName} is required`);
        }
      }
      });
    }
  
    // Validate all fields are filled
    if (inputNotFilled.length !== 0) {
      this.setState({
        showFillAlert: true,
        fieldsNeedFilling: inputNotFilled,
        step: valPages[inputNotFilled[0]] || 1,
      });
      return;
    }
  
    // Start login and get signing URL
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
          // Transmit form info to backend
          childName: this.state.childName,
          childAge: this.state.childAge,
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
          vendors: this.state.vendors, // Include vendors array
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
              // Clear all form fields
              childName: "",
              childAge: "",
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
              fieldsNeedFilling: [],
              vendors: [],
              activeKey: null,
            },
            () => {
              // Clear local storage for security
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

  // Handle the addition of a new vendor
  addVendor() {
    const newVendor = {
      id: Date.now(),  // Use a timestamp or a UUID for a unique ID
      name: "",
      dollar: 0,
      family: "",
      account: "",
      address: "",
      city: "",
      state: "",
      zip: ""
    };
    this.setState((prevState) => ({
      vendors: [...prevState.vendors, newVendor],
    }));
  };
  

  // Handle the deletion of a vendor
  deleteVendor(vendorId) {
    this.setState((prevState) => ({
      vendors: prevState.vendors.filter((vendor) => vendor.id !== vendorId),
    }));
  };

  // Handle change in vendor details (name/address)
  handleVendorChange(index, field, value){
    const updatedVendors = this.state.vendors.map((vendor, i) =>
      i === index ? { ...vendor, [field]: value } : vendor
    );
    this.setState({ vendors: updatedVendors });
  }

  // Toggle accordion items
  toggleAccordion(e){
    this.setState({ activeKey: e })
  };

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
            addVendor={this.addVendor}
            deleteVendor={this.deleteVendor}
            handleVendorChange={this.handleVendorChange}
            toggleAccordion={this.toggleAccordion}
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
        curForm = <h1>Error</h1>;
    }
    return (
      <div className="input-page">
        <div id="form-header">Apply For Aid</div>
        {this.state.showFillAlert ? (
          <Row>
            <Col></Col>
            <Col sm={8}>
              <Alert
                variant="danger"
                onClose={this.dismissFillAlert}
                dismissible
              >
                <Alert.Heading>
                  Please fill out or fix the following fields:
                </Alert.Heading>
                <ListGroup variant="flush">
                  {this.state.fieldsNeedFilling.map((field, idx) => (
                    <ListGroup.Item variant="danger" key={idx}>
                      {field}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Alert>
            </Col>
            <Col></Col>
          </Row>
        ) : (
          <span></span>
        )}
        <Row className="left-stuff">
          <Col></Col>
          {curForm}
          <Col></Col>
        </Row>
      </div>
    );
  }
}

export default FamilyForm;
