import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";

import "./ModalWrapper.scss";

class ModalWrapper extends Component {
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

  renderFront = () => {
    return <div className="front">{this.props.renderFrontModal()}</div>
  }

  renderBack = () => {
    if (!this.props.renderBackModal) {
      return
    }

    return <div className="back">{this.props.renderBackModal()}</div>
  }

  render() {
    return (
      <CSSTransition
        in={this.props.show}
        timeout={{ enter: 0, exit: 300 }}
        className="ModalWrapper-transition"
        unmountOnExit
      >
        <div>
          <div
            className={`ModalWrapper ${this.props.theme} 
              ${this.props.pending ? "pending" : ""}
              ${this.props.completed ? "completed" : ""}
            `}
          >
            <div className="modal">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="wrapper">
                    {this.renderFront()}
                    {this.renderBack()}
                  </div>
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

ModalWrapper.propTypes = {
  theme: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  renderFrontModal: PropTypes.func.isRequired,
  // non-required props
  renderBackModal: PropTypes.func,
  pending: PropTypes.bool,
  completed: PropTypes.bool
};

export default ModalWrapper;
