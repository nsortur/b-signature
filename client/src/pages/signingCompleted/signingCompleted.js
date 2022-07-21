import React from "react";
const queryString = require("query-string");

class SigningDone extends React.Component {
  constructor(props) {
    super(props);
    this.state = { signResult: "" };
  }

  componentDidMount() {
    this.setState({
      signResult: queryString.parse(this.props.location.search).event,
    });
  }

  render() {
    let showSignResult;
    switch (this.state.signResult) {
      case "cancel":
        showSignResult = (
          <div>
            <h1 className="page-title">Signing has been cancelled.</h1>
            <h3>If unintentional, please resubmit form.</h3>
          </div>
        );
        break;
      case "decline":
        showSignResult = (
          <div>
            <h1 className="page-title">Signing has been declined.</h1>
            <h3>If unintentional, please resubmit form.</h3>
          </div>
        );
        break;
      default:
        showSignResult = (
          <div>
            <h1 className="page-title">Thank you!</h1>
            <h3>
              The form has been sent to your social worker for completion.
            </h3>
          </div>
        );
    }
    return <header className="App-header">{showSignResult}</header>;
  }
}

export default SigningDone;
