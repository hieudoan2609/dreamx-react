import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./TransferCompleteModal.scss";
import Button from "./Button";

class TransferCompleteModal extends Component {
  renderModalBody = () => {
    const action = this.props.type === "deposit" ? "Deposit" : "Withdrawal";

    if (this.props.success) {
      return (
        <div className="modal-body">
          <ion-icon name="checkmark-circle" />
          <h5 className="modal-title">Complete</h5>
          <p>
            {action} will show up shortly under the <b>Transfers</b> tab.
          </p>
          <Button theme={this.props.theme} onClick={this.props.onHide}>
            Close
          </Button>
        </div>
      );
    } else {
      return (
        <div className="modal-body">
          <ion-icon name="settings" />
          <h5 className="modal-title">Maintenance</h5>
          <p>System is under maintenance, please try again later.</p>
          <Button theme={this.props.theme} onClick={this.props.onHide}>
            Close
          </Button>
        </div>
      );
    }
  };

  render() {
    return (
      <div className={`TransferCompleteModal ${this.props.theme}`}>
        {this.renderModalBody()}
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

TransferCompleteModal.propTypes = {
  theme: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired
};

export default TransferCompleteModal;
