import React from "react"
const queryString = require('query-string');

class SigningDone extends React.Component {

  constructor(props) {
    super(props);
    this.state = {signResult: ''};
  }

  componentDidMount() {
    this.setState({signResult: queryString.parse(this.props.location.search).event});
  }

  render() {
    return (
      <header className='App-header'>
        <h1>Thank you! You'll hear back from us soon.</h1>
        <h3>Signature Result: {this.state.signResult}</h3>
      </header>
    );
  }
}

export default SigningDone;