import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Modal.scss";

class Modal extends Component {
  componentDidUpdate = () => {
    this.disableScrolling();
  };

  disableScrolling = () => {
    if (this.props.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  };

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
                <div className="close" onClick={this.props.onHide}>
                  <ion-icon name="close-circle" />
                </div>
              </div>

              <div className="modal-body">
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Amount"
                    spellCheck="false"
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">DEPOSIT</span>
                  </div>
                </div>
                <small className="form-text text-muted">
                  Deposit entire balance
                </small>
              </div>
            </div>
          </div>

          <div className="backdrop" onClick={this.props.onHide} />
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

Modal.propTypes = {
  theme: PropTypes.string.isRequired,
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired
};

export default Modal;
