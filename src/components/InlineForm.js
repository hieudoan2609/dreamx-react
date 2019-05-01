import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import Loading from "./Loading";
import "./InlineForm.scss";

class InlineForm extends Component {
  render() {
    return (
      <div
        className={`InlineForm input-group ${this.props.theme} ${
          this.props.pending ? "pending" : ""
        }`}
      >
        <input
          onChange={this.props.onAmountChange}
          type="number"
          className={`form-control ${this.props.error ? "invalid" : ""}`}
          placeholder="Amount"
          spellCheck="false"
          value={this.props.amount}
          disabled={this.props.pending ? true : false}
        />
        <div className="input-group-append">
          <span className="input-group-text">
            <Loading
              type="button"
              active={this.props.pending ? true : false}
              theme={this.props.theme}
            />
            <div className="body" onClick={this.props.onSubmit}>
              {this.props.type.toUpperCase()}
            </div>
          </span>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getChartData
// };

InlineForm.propTypes = {
  onAmountChange: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  pending: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  inputPlaceHolder: PropTypes.string.isRequired
};

export default InlineForm;
