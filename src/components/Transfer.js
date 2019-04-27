import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";

import "./Transfer.scss";
import { capitalize } from "../helpers";

class Transfer extends Component {
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
        className={`Transfer ${this.props.theme}`}
        unmountOnExit
      >
        <div>
          <div className="modal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {capitalize(this.props.type)} {capitalize(this.props.name)}{" "}
                    ({this.props.symbol.toUpperCase()})
                  </h5>
                  <div className="close" onClick={this.props.onHide}>
                    <ion-icon name="close-circle" />
                  </div>
                </div>

                <div className="modal-body">
                  <div className="input-group">
                    <input
                      onChange={this.props.onAmountChange}
                      type="number"
                      className={`form-control ${
                        this.props.error ? "invalid" : ""
                      }`}
                      placeholder="Amount"
                      spellCheck="false"
                      value={this.props.amount}
                    />
                    <div
                      className="input-group-append"
                      onClick={this.props.onSubmit}
                    >
                      <span className="input-group-text">
                        {this.props.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="invalid-feedback">{this.props.error}</div>
                  <small className="form-text text-muted">
                    {capitalize(this.props.type)} entire balance
                  </small>
                </div>
              </div>
            </div>

            <div className="backdrop" onClick={this.props.onHide} />
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

Transfer.propTypes = {
  theme: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default Transfer;
