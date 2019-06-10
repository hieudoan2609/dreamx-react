import React, { Component } from "react";
import { connect } from "react-redux";
// import PropTypes from "prop-types";

import "./Trade.scss";
import TabMenu from "./TabMenu";
import Button from "./Button";

class Trade extends Component {
  state = {
    tabs: ["buy", "sell"],
    currentTab: "buy"
  };

  handleTabChange = tab => {
    this.setState({ currentTab: tab });
  };

  renderNotLoggedInOverlay = () => {
    if (!this.props.account.address) {
      return <div className="not-logged-in">Please log in to trade.</div>;
    }
  };

  render() {
    return (
      <div className={`Trade card ${this.props.app.theme}`}>
        {this.renderNotLoggedInOverlay()}
        <TabMenu
          items={this.state.tabs}
          currentItem={this.state.currentTab}
          theme={this.props.app.theme}
          onChange={this.handleTabChange}
        />
        <div className="body">
          <div className="balance">
            <div className="header">BALANCE</div>
            <div className="value">0.12345678 ETH</div>
          </div>

          <div className="amount-and-price">
            <input
              type="number"
              className={`form-control`}
              placeholder="Amount"
              spellCheck="false"
            />
            <input
              type="number"
              className={`form-control`}
              placeholder="Price"
              spellCheck="false"
            />
          </div>

          <div className="fee-and-total">
            <small className="fee">
              Fee (1%): <b>0.12345678 ETH</b>
            </small>
            <small className="total">
              Total: <b>0.12345678 ETH</b>
            </small>
          </div>

          <div className="submit">
            <Button theme={this.props.app.theme} fullWidth={true}>
              {this.state.currentTab}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

// const mapActionsToProps = {
//  getTradeData
// };

// Trade.propTypes = {
//   theme: PropTypes.string.isRequired
// };

export default connect(mapStateToProps)(Trade);
