import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";

import { accountLogin } from "../actions";

class Login extends Component {
  readState = () => {
    console.log(this.props.account);
  };

  render() {
    return (
      <div>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={() => this.props.accountLogin("LOL")}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={this.readState}
        >
          Read account state
        </Button>
      </div>
    );
  }
}

const mapStateToProps = ({ account }) => {
  return { account };
};

const mapActionsToProps = {
  accountLogin
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Login);
