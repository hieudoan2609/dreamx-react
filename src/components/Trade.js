import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Trade.scss";
import TabMenu from "./TabMenu";

class Trade extends Component {
  state = {
    tabs: ["buy", "sell"],
    currentTab: "buy"
  };

  handleTabChange = tab => {
    this.setState({ currentTab: tab });
  };

  render() {
    return (
      <div className={`Trade card ${this.props.theme}`}>
        <TabMenu
          items={this.state.tabs}
          currentItem={this.state.currentTab}
          theme={this.props.theme}
          onChange={this.handleTabChange}
        />
        <div className="body">
          <div className="balance">
            <div className="header">BALANCE</div>
            <div className="value">0.12345678 ETH</div>
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

Trade.propTypes = {
  theme: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(Trade);
