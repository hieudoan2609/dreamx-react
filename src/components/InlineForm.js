import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import Loading from "./Loading";
import "./InlineForm.scss";

class InlineForm extends Component {
  render() {
    return (
      <div
        className={`InlineForm ${this.props.theme} ${
          this.props.pending ? "pending" : ""
        }`}
      >
        <div className="input-group">
          <input
            onChange={this.props.onAmountChange}
            className={`form-control ${this.props.error ? "invalid" : ""}`}
            placeholder="Amount"
            spellCheck="false"
            value={this.props.value}
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
        <div className="invalid-feedback">{this.props.error}</div>
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
  value: PropTypes.string.isRequired,
  pending: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  inputPlaceHolder: PropTypes.string.isRequired
};

export default InlineForm;
