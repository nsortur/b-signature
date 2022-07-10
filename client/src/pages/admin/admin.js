import React from "react";
import {
  FormControl,
  InputGroup,
  Button,
  Container,
  Table,
  Accordion,
  Badge,
  Spinner,
  Row,
  Col,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import download from "downloadjs";

// PAGE NO LONGER USED IN NEW WORKFLOW
class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patientName: "",
      resultsDisplay: "",
      passwordInput: "",
      loadingSearch: false,
      loadingSearchAll: false,
      authenticated: false,
      showFailLogin: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.triggerSearch = this.triggerSearch.bind(this);
    this.triggerSearchAll = this.triggerSearchAll.bind(this);
    this.triggerExportCSV = this.triggerExportCSV.bind(this);
    this.fetchAidInfo = this.fetchAidInfo.bind(this);
    this.renderResults = this.renderResults.bind(this);
  }

  // attempts administrator login for admin portal access
  handleLogin(event) {
    try {
      fetch("/api/adminLogin", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          adminPassword: this.state.passwordInput,
        }),
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            Promise.reject();
          }
        })
        .then((data) => {
          if (data.loginSuccess) {
            this.setState({ authenticated: true });
          } else {
            this.setState({ showFailLogin: true });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  // handles input change
  handleInputChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }

  // retrieve specific patient information
  triggerSearch(event) {
    event.preventDefault();
    this.setState({ loadingSearch: true });
    this.fetchAidInfo(true);
  }

  // retrieves all patient information
  triggerSearchAll(event) {
    event.preventDefault();
    this.setState({ loadingSearchAll: true });
    this.fetchAidInfo(false);
  }

  // downloads CSV from backend data
  triggerExportCSV(event) {
    try {
      fetch("/api/exportAll", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
      })
        .then(async (res) => {
          if (res.ok) {
            const blob = await res.blob();
            download(blob, "bepos_all_patient_data.csv");
          } else {
            Promise.reject();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Retrieves information about a patient from their submitted forms
   *
   * @param {boolean} searchSingle Whether to query specific patient info or query all information
   */
  fetchAidInfo(searchSingle) {
    try {
      (searchSingle
        ? fetch("/api/queryAidInfo", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              childName: this.state.patientName,
            }),
            credentials: "include",
          })
        : fetch("/api/queryAllPatientInfo", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            credentials: "include",
          })
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            Promise.reject();
          }
        })
        .then((data) => {
          this.renderResults(data);
          this.setState({ loadingSearch: false, loadingSearchAll: false });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Creates and displays patient information from submitted form(s) and submitted form status
   *
   * @param {object} medFamilyInfo all social worker and family information from both forms
   */
  renderResults(medFamilyInfo) {
    const allNames = [];

    // all information in name, table pairs
    const nameTableFamilyInfo = medFamilyInfo.familyInfoResults.map(
      this.patientDocumentToTable
    );
    allNames.push(...nameTableFamilyInfo);

    const nameTableMedicalInfo = medFamilyInfo.medInfoResults.map(
      this.patientDocumentToTable
    );
    allNames.push(...nameTableMedicalInfo);

    const visitedNames = [];
    let display;
    if (allNames.length !== 0) {
      display = (
        <Accordion defaultActiveKey="0">
          {allNames.map((nameTablePair, idx) => {
            // iterate through all the names
            let name = nameTablePair.patientName;

            // don't double count names in both forms
            if (!visitedNames.includes(name)) {
              visitedNames.push(name);

              // declare badges that will be conditionally rendered
              let familyBadge = (
                  <Badge pill bg="danger">
                    Family application unfilled
                  </Badge>
                ),
                socialBadge = (
                  <Badge pill bg="danger">
                    Medical form unfilled
                  </Badge>
                ),
                familyInfo = <span></span>,
                socialInfo = <span></span>,
                familyInput = false,
                medicalInput = false;

              // if name is in original family info [{patientName, info}, {...}, ...]
              // then update badge and family application info
              if (
                nameTableFamilyInfo
                  .map((elem) => elem.patientName)
                  .includes(name)
              ) {
                // family filled form
                familyInput = true;
                familyBadge = (
                  <Badge pill bg="success">
                    Family application filled
                  </Badge>
                );
                familyInfo = nameTableFamilyInfo.find(
                  (elem) => elem.patientName === name
                ).group;
              }
              // if name is in original medical info [{patientName, info}, {...}, ...]
              // then update badge and medical form info
              if (
                nameTableMedicalInfo
                  .map((elem) => elem.patientName)
                  .includes(name)
              ) {
                // social worker filled form
                medicalInput = true;
                socialBadge = (
                  <Badge pill bg="success">
                    Medical form filled
                  </Badge>
                );
                socialInfo = nameTableMedicalInfo.find(
                  (elem) => elem.patientName === name
                ).group;
              }
              // attached documents
              const popover = (
                <Popover id="popover-basic">
                  <Popover.Header as="h3">Envelope information</Popover.Header>
                  <Popover.Body>
                    <p>
                      Sign status:{" "}
                      <a style={{ color: "green" }}>Signing completed</a>
                    </p>
                    <p>
                      Parent form: <a href="">View</a>
                    </p>
                    <p>
                      Social worker form: <a href="">View</a>
                    </p>
                  </Popover.Body>
                </Popover>
              );

              return (
                <Accordion.Item key={idx} eventKey={idx}>
                  <Accordion.Header>
                    <b>{nameTablePair.patientName}</b>&nbsp;
                    {familyBadge}&nbsp;
                    {socialBadge}
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="d-grid gap-2" id="attachDocButton">
                      {/* <Button variant="primary">Attach documents</Button> */}
                      <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        overlay={popover}
                      >
                        <Button variant="primary">View envelope info</Button>
                      </OverlayTrigger>
                    </div>
                    {familyInput ? (
                      <h3>Family application information</h3>
                    ) : (
                      <span></span>
                    )}
                    {familyInfo}
                    {medicalInput ? (
                      <h3>Medical form information</h3>
                    ) : (
                      <span></span>
                    )}
                    {socialInfo}
                  </Accordion.Body>
                </Accordion.Item>
              );
            } else {
              return <span></span>;
            }
          })}
        </Accordion>
      );
    } else {
      display = <h2>Patient not found! Please double check spelling.</h2>;
    }

    this.setState({ resultsDisplay: display });
  }

  /**
   * Maps patient information to a two column Table, and gets patient name for belonging group
   *
   * @param {object} doc The document containing all patient information in the form of json
   * @return {object} The Table and corresponding patient name
   */
  patientDocumentToTable(doc) {
    let patientName;
    return {
      group: (
        <Table>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(doc).map((key, idx) => {
              if (key === "childName") {
                patientName = doc[key];
              }
              if (key !== "_id") {
                return (
                  <tr key={idx}>
                    <td>{key}</td>
                    <td>{doc[key]}</td>
                  </tr>
                );
              } else {
                return <span></span>;
              }
            })}
          </tbody>
        </Table>
      ),
      patientName: patientName,
    };
  }

  render() {
    const loadingIcon = (
      <Spinner animation="border" role="status" variant="light">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );

    if (this.state.authenticated) {
      return (
        <Container id="">
          <form>
            <div id="form-header">Search Patients</div>
            <InputGroup size="lg">
              <InputGroup.Text id="inputGroup-sizing-lg">
                Patient Name
              </InputGroup.Text>
              <FormControl
                aria-label="Large"
                aria-describedby="inputGroup-sizing-sm"
                value={this.state.patientName}
                onChange={this.handleInputChange}
                name="patientName"
              />
            </InputGroup>
            <Button
              variant="secondary"
              onClick={this.triggerExportCSV}
              className="form-button"
            >
              Download all complete data
            </Button>
            <Button
              variant="secondary"
              onClick={this.triggerSearchAll}
              className="form-button"
            >
              {this.state.loadingSearchAll
                ? loadingIcon
                : "Display all patients"}
            </Button>
            <Button
              variant="success"
              type="submit"
              onClick={this.triggerSearch}
              className="form-button"
            >
              {this.state.loadingSearch ? loadingIcon : "Search"}
            </Button>
          </form>
          {this.state.resultsDisplay}
        </Container>
      );
    } else {
      return (
        <Container id="">
          <Row>
            <Col></Col>
            <Col xs={6}>
              <div id="form-header">Admin Portal</div>
              <InputGroup size="sm">
                <InputGroup.Text id="inputGroup-sizing-sm">
                  Password
                </InputGroup.Text>
                <FormControl
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  value={this.state.passwordInput}
                  onChange={this.handleInputChange}
                  name="passwordInput"
                  placeholder="1234 (for demonstration)"
                />
              </InputGroup>
              <Button
                variant="warning"
                onClick={this.handleLogin}
                className="form-button"
              >
                Login
              </Button>
              {this.state.showFailLogin ? (
                <h4>Incorrect password.</h4>
              ) : (
                <span></span>
              )}
            </Col>
            <Col></Col>
          </Row>
        </Container>
      );
    }
  }
}

export default AdminPage;
