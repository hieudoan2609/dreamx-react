import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";

import "./Modal.scss";
import Transfer from "./Transfer";

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

  onEsc = event => {
    if (event.keyCode === 27) {
      this.props.onHide();
    }
  };

  componentDidMount = () => {
    document.addEventListener("keydown", this.onEsc, false);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.onEsc, false);
  };

  render() {
    return (
      <CSSTransition
        in={this.props.show}
        timeout={{ enter: 0, exit: 300 }}
        className="Modal-transition"
        unmountOnExit
      >
        <div>
          <div
            className={`Modal ${this.props.theme} ${
              this.props.pending ? "pending" : ""
            }`}
          >
            <div className="modal">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <Transfer
                    theme={this.props.theme}
                    onHide={this.props.onHide}
                    type={this.props.type}
                    name={this.props.name}
                    symbol={this.props.symbol}
                    amount={this.props.amount}
                    onAmountChange={this.props.onAmountChange}
                    error={this.props.error}
                    onSubmit={this.props.onSubmit}
                    pending={this.props.pending}
                  />
                </div>
              </div>

              <div className="backdrop" onClick={this.props.onHide} />
            </div>
          </div>
        </div>
      </CSSTransition>
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
  show: PropTypes.bool.isRequired,
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

export default Modal;
