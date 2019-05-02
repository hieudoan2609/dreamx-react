import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Transfer.scss";
import { capitalize } from "../helpers";
import InlineForm from "./InlineForm";

class Transfer extends Component {
  render() {
    return (
      <div className={`Transfer ${this.props.theme}`}>
        <div className="modal-header">
          <h5 className="modal-title">
            {capitalize(this.props.type)} {capitalize(this.props.name)} (
            {this.props.symbol.toUpperCase()})
          </h5>
          <div className="close" onClick={this.props.onHide}>
            <ion-icon name="close-circle" />
          </div>
        </div>

        <div className="modal-body">
          <InlineForm
            onAmountChange={this.props.onAmountChange}
            error={this.props.error}
            amount={this.props.amount}
            pending={this.props.pending}
            theme={this.props.theme}
            onSubmit={this.props.onSubmit}
            type={this.props.type}
            inputPlaceHolder={"Amount"}
          />
          <small className="form-text text-muted">
            {capitalize(this.props.type)} entire balance
          </small>
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

Transfer.propTypes = {
  theme: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired
};

export default Transfer;
