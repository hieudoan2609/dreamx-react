import React, { Component } from "react";
// import { connect } from "react-redux";

import Login from "./Login";

class Account extends Component {
  render() {
    return (
      <div className="Account">
        <Login />
      </div>
    );
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapDispatchToProps = {
//  getChartData
// };

export default Account;
