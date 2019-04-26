import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Modal.scss";
import Button from "./Button";

class Modal extends Component {
  render() {
    return (
      <div
        className={`Modal ${this.props.theme} ${this.props.show ? "show" : ""}`}
      >
        <div className="modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Deposit Ethereum (ETH)</h5>
              </div>

              <div className="modal-body">
                <div className="input-group">
                  <input
                    className="form-control search"
                    placeholder="Amount"
                    spellCheck="false"
                  />
                </div>
                <small class="form-text text-muted">
                  Deposit entire balance
                </small>
              </div>

              <div className="modal-footer">
                <Button theme={this.props.theme}>DEPOSIT</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop" />
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

Modal.propTypes = {
  theme: PropTypes.string.isRequired,
  show: PropTypes.bool
  // onHide: PropTypes.func.isRequired
};

export default Modal;
