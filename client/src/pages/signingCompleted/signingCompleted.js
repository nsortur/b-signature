import React from "react"

class SigningDone extends React.Component {

  constructor(props) {
    super(props);
    this.state = {signResult: ''};
  }

  componentDidMount() {
    fetch("/ds_return" + this.props.location.search, {credentials: 'include'})
    .then(res => res.json())
    .then(data => {
      this.setState({signResult: data.signResult});
    })
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